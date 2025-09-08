import db from "../../../config/db.js";
import { NODE_ENV } from "../../../config/env.js";
const dashboardInfoController = async (req, res) => {
  try {
    // Step 1: Set up Pagination Parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // --- Building the Queries based on the new schema ---

    // Step 2: Build the Query to Count Total Items
    const countQuery = db('Payments')
      .join('PaymentUsers', 'Payments.payment_user_id', 'PaymentUsers.payment_user_id')
      .join('Projects', 'Payments.project_id', 'Projects.project_id')
      .count('Payments.payment_id as total')
      .first();

    // Step 3: Build the Query to Fetch the Actual Page of Data
    const dataQuery = db('Payments')
      .join('PaymentUsers', 'Payments.payment_user_id', 'PaymentUsers.payment_user_id')
      .join('Projects', 'Payments.project_id', 'Projects.project_id')
      .select(
        'Payments.payment_id',
        'Payments.amount',
        'Payments.status',
        'Payments.created_at',
        'PaymentUsers.email as user_email', // Get email from PaymentUsers
        'Projects.project_url'              // Get project_url from Projects
      )
      .orderBy('Payments.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Step 4: Execute Both Queries at the Same Time
    const [totalResult, data] = await Promise.all([countQuery, dataQuery]);
    
    const totalItems = totalResult.total;
    const totalPages = Math.ceil(totalItems / limit);

    // Step 5: Send the final, structured response
    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully.",
      data,
      pagination: {
        total_items: totalItems,
        total_pages: totalPages,
        current_page: page,
        limit: limit
      }
    });

  } catch (error) {
    console.error("Error fetching dashboard info:", error);
    const message = NODE_ENV === 'development' ? error.message : 'Failed to fetch dashboard information.';
    res.status(500).json({ success: false, message });
  }
};
export default dashboardInfoController;

