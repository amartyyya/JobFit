import { dbConnect } from '@/lib/dbConnect'
import { InfoModel } from '@/model/UserPortfolioInfo'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

export async function fetchPortfolioData() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error('Unauthorized');
    }
    const data = await InfoModel.findOne({ userId: session.user.id });
    return data;
  } catch (err) {
    console.error('Error fetching portfolio data:', err);
    throw err;
  }
}

