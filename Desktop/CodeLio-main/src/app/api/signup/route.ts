import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/dbConnect';
import { UserModel } from '@/model/UserPortfolioInfo';
import { sendWelcomeEmail } from '@/helpers/sendWelcomeEmail';

function validateInput(email: string, username: string, password: string) {
  if (!username || !email || !password) {
    return 'All fields are required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return null;
}

export async function POST(req: Request) {
  console.log("JKHJKHJK ")
  await dbConnect();

  try {
    const { username, email, password } = await req.json();

    const validationError = validateInput(email, username, password);
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this email' },
        { status: 300 }
      );
    }

    const existingUserByUsername = await UserModel.findOne({ username });
    if (existingUserByUsername) {
      return NextResponse.json(
        { success: false, message: 'Username is already taken' },
        { status: 200 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      isVerified: true, // Mark user as verified since no OTP is required
      isAcceptingMessages: true,
    });

    await newUser.save();

    await sendWelcomeEmail(email, username); // Send the welcome email

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully. Welcome to Codelio!',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { success: false, message: 'Error registering user' },
      { status: 500 }
    );
  }
}
