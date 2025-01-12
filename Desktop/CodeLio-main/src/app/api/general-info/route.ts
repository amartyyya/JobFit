import { dbConnect } from '@/lib/dbConnect';
import { InfoModel} from '@/model/UserPortfolioInfo';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import  {UserModel} from '@/model/UserPortfolioInfo';




// Helper function to validate portfolio data
function validatePortfolioData(data: any) {
  // Required fields for portfolio validation
  const requiredFields = ['introduction', 'experience', 'linkedin', 'github', 'projects'];
  const missingFields = requiredFields.filter(field => !data[field]);

  // Check for missing fields
  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(', ')}`;
  }

  // Validate character limits for introduction and experience
  if (data.introduction.length > 3000) {
    return 'Introduction cannot exceed 3000 characters';
  }

  if (data.experience.length > 3000) {
    return 'Experience cannot exceed 3000 characters';
  }

  // Ensure at least one project is provided
  if (!data.projects || !Array.isArray(data.projects) || data.projects.length === 0) {
    return 'At least one project is required';
  }

  // Validate LinkedIn and GitHub URLs using regex
  const urlPattern = /^https?:\/\/.+/;
  if (!urlPattern.test(data.linkedin)) {
    return 'Invalid LinkedIn URL';
  }

  if (!urlPattern.test(data.github)) {
    return 'Invalid GitHub URL';
  }

  // Return null if validation passes
  return null;
}

// GET handler to fetch portfolio data
export async function GET(request: Request) {
  try {
    await dbConnect(); // Establish database connection

    const session = await getServerSession(authOptions); // Get the current user session
    if (!session) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401 } // Return 401 if user is not authenticated
      );
    }

    // Fetch the portfolio for the authenticated user
    const portfolio = await InfoModel.findOne({ userId: session.user.id });
    if (!portfolio) {
      return new Response(
        JSON.stringify({ success: false, message: 'Portfolio not found' }),
        { status: 404 } // Return 404 if portfolio does not exist
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: portfolio }),
      { status: 200 } // Return the portfolio data
    );
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error fetching portfolio' }),
      { status: 500 } // Return 500 on server error
    );
  }
}

// POST handler to create/update portfolio
export async function POST(request: Request) {
  await dbConnect(); // Ensure database connection

  try {
    const session = await getServerSession(authOptions); // Get the current user session
    if (!session) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401 } // Return 401 if user is not authenticated
      );
    }

    const data = await request.json(); // Parse the request body as JSON
    
    // Validate input data
    const validationError = validatePortfolioData(data);
    if (validationError) {
      return new Response(
        JSON.stringify({ success: false, message: validationError }),
        { status: 400 } // Return 400 if validation fails
      );
    }

    // Add the user ID to the portfolio data
    data.userId = session.user.id;
    
    // Update existing portfolio or create a new one
    const portfolio = await InfoModel.findOneAndUpdate(
      { userId: session.user.id }, // Find portfolio by user ID
      data, // Update with new data
      { new: true, upsert: true, runValidators: true } // Create if not found, validate input
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Portfolio saved successfully',
        data: portfolio
      }),
      { status: 200 } // Return success response
    );
  } catch (error: any) {
    console.error('Error saving portfolio:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Validation error', 
          errors: validationErrors 
        }),
        { status: 400 } // Return 400 for validation error
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: 'Error saving portfolio' }),
      { status: 500 } // Return 500 on server error
    );
  }
}

// PATCH handler to update specific fields
export async function PATCH(request: Request) {
  await dbConnect(); // Ensure database connection

  try {
    const session = await getServerSession(authOptions); // Get the current user session
    if (!session) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401 } // Return 401 if user is not authenticated
      );
    }

    const updates = await request.json(); // Parse the updates from the request body
    
    // Update portfolio fields for the authenticated user
    const portfolio = await InfoModel.findOneAndUpdate(
      { userId: session.user.id },
      { $set: updates }, // Apply the updates
      { new: true, runValidators: true } // Return updated document and validate input
    );

    if (!portfolio) {
      return new Response(
        JSON.stringify({ success: false, message: 'Portfolio not found' }),
        { status: 404 } // Return 404 if portfolio does not exist
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Portfolio updated successfully',
        data: portfolio
      }),
      { status: 200 } // Return success response
    );
  } catch (error: any) {
    console.error('Error updating portfolio:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Validation error', 
          errors: validationErrors 
        }),
        { status: 400 } // Return 400 for validation error
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: 'Error updating portfolio' }),
      { status: 500 } // Return 500 on server error
    );
  }
}

// DELETE handler to remove portfolio
export async function DELETE(request: Request) {
  await dbConnect(); // Ensure database connection

  try {
    const session = await getServerSession(authOptions); // Get the current user session
    if (!session) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401 } // Return 401 if user is not authenticated
      );
    }

    // Delete the portfolio for the authenticated user
    const portfolio = await InfoModel.findOneAndDelete({ userId: session.user.id });
    
    if (!portfolio) {
      return new Response(
        JSON.stringify({ success: false, message: 'Portfolio not found' }),
        { status: 404 } // Return 404 if portfolio does not exist
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Portfolio deleted successfully'
      }),
      { status: 200 } // Return success response
    );
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error deleting portfolio' }),
      { status: 500 } // Return 500 on server error
    );
  }
}
