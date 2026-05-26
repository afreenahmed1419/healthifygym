import { Router, Request, Response } from "express";
import { query } from "express-validator";
import { validate } from "../middleware/validation";
import { getActiveFAQs, getFAQsByCategory } from "../services/SupabaseService";
import { searchFAQs } from "../services/FAQService";

const router = Router();

// GET /api/faqs/search?query=...&limit=5
router.get(
  "/search",
  [
    query("query").isString().trim().isLength({ min: 2 }).withMessage("Search query must be at least 2 characters."),
    query("limit").optional().isInt({ min: 1, max: 20 }).toInt(),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const searchQuery = req.query["query"] as string;
      const limit = parseInt(req.query["limit"] as string) || 5;

      const results = await searchFAQs(searchQuery, limit);

      res.json({ success: true, results });
    } catch (err) {
      console.error("[faqSearch]", err);
      res.status(500).json({ success: false, message: "Search failed. Please try again." });
    }
  }
);

// GET /api/faqs?category=...
router.get(
  "/",
  [query("category").optional().isString().trim()],
  validate,
  async (req: Request, res: Response) => {
    try {
      const { category } = req.query as { category?: string };
      const faqs = category ? await getFAQsByCategory(category) : await getActiveFAQs();
      res.json({ success: true, data: faqs });
    } catch (err) {
      console.error("[getFAQs]", err);
      res.status(500).json({ success: false, message: "Failed to fetch FAQs." });
    }
  }
);

export default router;
