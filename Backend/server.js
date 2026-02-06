const dotenv = require('dotenv');
const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const upload = multer({ dest: 'uploads/' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



app.post('/api/analyze', upload.single('image'), async (req, res) => {
    try {
        const { userGoals } = req.body;
        const filePath = req.file.path;

        // FIXED: Added responseMimeType to force valid JSON (prevents Markdown errors)
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash", // Reverting to 1.5 as 2.5 is experimental/limited access
            generationConfig: { responseMimeType: "application/json" }
        });

        const imagePart = {
            inlineData: {
                data: fs.readFileSync(filePath).toString("base64"),
                mimeType: req.file.mimetype,
            },
        };

        const megaPrompt = `
            **Role:** You are "Nutri-X," an intelligent food copilot. Your mission is to analyze user profiles and food data to provide a simple, high-impact health assessment.

            **User Profile:**
            ${userGoals}

            **Phase 1: Internal Logic (Do Not Output)**
            1. **Profiling:** Convert casual goals into clear objectives. Identify strict allergies.
            2. **Data Extraction:** Parse ingredients and macros. 
            3. **Confidence Calculation:** Start at 100%. Deduct 20% for wrinkles, 30% for partial data, and 10% for "may contain" warnings.
            4. **Flag Analysis:** Identify Red Flags (risks/allergies) and Green Flags (goal alignment).
            5. **Minimum Flag Constraint:** The total count of flags across both categories must be AT LEAST 2. If one category is [], you must provide at least 2 flags for the other category.
            6. **Shock Comparison:** If the product is unhealthy (more red flags than green, or high sugar/salt/fat), generate a shocking comparison to **common Indian junk food/fast food** (e.g., "More sugar than 2 Gulab Jamuns," "Oilier than a plate of Chole Bhature," or "Saltier than a packet of Masala Chips"). Avoid fancy/foreign names; use familiar Indian street food or snacks. If the product is "Good," set this to [].
            7. **Alternative Logic:** If the final_verdict is NOT 🟢 YES, suggest a general category of food followed by a specific, high-quality brand-name product available in the market. 
            - Provide these as two separate strings within an array for the better_alternative field.
            - String 1: The general dietary category/reason.
            - String 2: ONLY the exact product name (e.g., "The Whole Truth Protein Bar").

            **Phase 2: Flag & Tip Logic (Strict Constraints)**
            - **Red Flag:** If an allergy or health risk exists, provide a 3-4 line detail (20-30 words). If none, the value MUST be [].
            - **Green Flag:** If the food aligns with user goals, provide a 3-4 line detail (20-30 words). If none, the value MUST be [].
            - **Pro Tip:** Suggest 1-2 items to pair with this product based on the user's input. Limit to 10-15 words total.

            **Phase 3: Final Output Constraints**
            - Use plain, non-technical language.
            - Output ONLY the following JSON format. No preamble, post-amble, or markdown code blocks.

            **Required JSON Format:**
            {
            "brief_summary": "A 2-3 sentence overview of the product in simple terms and how it fits your profile.",
            "green_flags": [
                "✅ [Ingredient/Fact]: [3-4 line detail, 20-30 words] (or [])."
            ],
            "red_flags": [
                "🚩 [Ingredient/Fact]: [3-4 line detail, 20-30 words] (or [])."
            ],
            "shock_comparison": "[Shocking Indian food comparison or [] ]",
            "better_alternative": [
                "[General Dietary Information/Category]",
                "[Exact Specific Product Name Only]"
            ],
            "pro_tip": "💡 [10-15 words suggesting additions/habits].",
            "confidence_score": [Integer 0-100],
            "final_verdict": [
                { "is_good": [Boolean: true/false] },
                "[🔴 NO | 🟡 CAUTION | 🟢 YES] - A clear 1-2 line recommendation."
            ]
            }
        `;

        const verdictResult = await model.generateContent([megaPrompt, imagePart]);
        const verdictResponse = await verdictResult.response;

        // FIXED: Extract the text string first!
        const jsonText = verdictResponse.text();
        console.log(jsonText);
        // Cleanup
        fs.unlinkSync(filePath);

        // FIXED: Parse the text string, not the object
        const parsedResult = JSON.parse(jsonText);

        // Send Response (Spread the result so frontend gets user_profile, product_data, etc.)
        res.json({
            success: true,
            ...parsedResult
        });

    } catch (error) {
        console.error(error); // FIXED: Removed the stray 's'

        // Cleanup if file exists (prevents file locking)
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

        res.status(500).json({ success: false, message: "AI Analysis failed" });
    }
});

app.post('/api/barcode', async (req, res) => {
    try {
        const { product_name, ingredients_text, nutriments, image_url, userGoals } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });
        const productContext = `
            Product Name: ${product_name}
            Ingredients: ${ingredients_text || "Not available"}
            Nutritional Values (per 100g):
            - Sugar: ${nutriments?.sugars_100g || "N/A"}g
            - Salt: ${nutriments?.salt_100g || "N/A"}g
            - Protein: ${nutriments?.proteins_100g || "N/A"}g
            - Fat: ${nutriments?.fat_100g || "N/A"}g
            - Energy: ${nutriments?.energy_kcal_100g || "N/A"} kcal
        `;

        const userContext = `User Goals / Allergies: "${userGoals || "General healthy eating"}"`;

        const barcodePrompt = `
            **Role:** You are "Nutri-X," an intelligent food copilot. Your mission is to analyze productInfo objects from barcode scans and provide high-impact health assessments tailored to the user's profile.

            **Input Context:**
            You will be provided with a productInfo object containing:
            - product_name: Name of the item.
            - ingredients_text: Raw ingredient string.
            - nutriments: Macro data (sugar, salt, protein, etc.).
            - image_url: URL of the product image.

            **Phase 1: Internal Logic (Do Not Output)**
            1. **Profiling:** Cross-reference ingredients and nutriments against user goals and strict allergies.
            2. **Flag Analysis:** - **Red Flags:** Triggered by allergies or high levels of negative nutrients relative to goals.
                - **Green Flags:** Triggered by beneficial ingredients or macro alignment.
            3. **Minimum Flag Constraint:** The total count of flags across both categories must be AT LEAST 2. If one category is "None found", you must find at least 2 flags for the other category.
            4. **Shock Comparison:** If the product contains high sugar, salt, or saturated fat, generate a short, shocking comparison to common junk food (e.g., "More sugar than a donut"). If healthy, set to "None".
            5. **Alternative Logic:** If the final_verdict is NOT 🟢 YES, identify one specific healthier alternative product that serves the same purpose.
            6. **Verdict Determination:** is_good is true if the product supports goals without safety risks; false if there is an allergy match or severe goal conflict.

            **Phase 2: Output Constraints**
            - **Tone:** Simplistic, non-technical. Use "you" or "your profile."
            - **Flag Details:** Exactly 3-4 lines and 20-30 words per flag.
            - **Pro Tip:** Exactly 10-15 words suggesting a pairing or habit.
            - **Empty States:** If a category has no flags, use exactly one string: "None found".
            - **Strict Format:** Output ONLY valid JSON. No preamble, post-amble, or markdown code blocks.

            **Required JSON Format:**
            {
            "brief_summary": "A 2-3 sentence overview of the product in simple terms and how it fits your profile.",
            "green_flags": [
                "✅ [Ingredient/Fact]: [3-4 line detail, 20-30 words, max 3 flags] (or [])."
            ],
            "red_flags": [
                "🚩 [Ingredient/Fact]: [3-4 line detail, 20-30 words, max 3 flags] (or [])."
            ],
            "shock_comparison": "[Shocking string or 'None']",
            "better_alternative": "[Specific product name or '[] if Green']",
            "pro_tip": "💡 [10-15 words suggesting additions/habits].",
            "confidence_score": 100,
            "final_verdict": [
                { "is_good": [true/false] },
                "[🔴 NO | 🟡 CAUTION | 🟢 YES] - A clear 1-2 line recommendation."
            ]
            }
        `;

        const result = await model.generateContent(barcodePrompt + "\n\n" + productContext);
        const responseText = result.response.text();
        console.log(responseText);

        res.json({
            success: true,
            product_details: {
                name: product_name,
                image: image_url,
                ingredients: ingredients_text
            },
            analysis: JSON.parse(responseText)
        });

    } catch (error) {
        console.error("Barcode Analysis Failed:", error);
        res.status(500).json({ success: false, message: "AI Analysis failed" });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));