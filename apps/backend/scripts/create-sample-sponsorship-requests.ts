import { DataSource } from 'typeorm';
import { SponsorshipRequest } from '../src/sponsorship/entities/sponsorship-request.entity';
import { User } from '../src/user/entities/user.entity';

const sampleApplicants = [
  {
    firstName: 'Ahmad',
    lastName: 'Hassan',
    email: 'ahmad.hassan@example.com',
    country: 'IR',
    reason: 'I need access to social media platforms and news websites that are blocked in Iran. As a journalist, I need to communicate with sources and access international news.',
    urgency: 'high'
  },
  {
    firstName: 'Wei',
    lastName: 'Chen',
    email: 'wei.chen@example.com',
    country: 'CN',
    reason: 'I need to access educational resources and research papers that are restricted in China. I am a student studying computer science.',
    urgency: 'medium'
  },
  {
    firstName: 'Dmitri',
    lastName: 'Petrov',
    email: 'dmitri.petrov@example.com',
    country: 'RU',
    reason: 'I need to access independent news sources and communicate with family abroad. Many platforms are blocked in Russia.',
    urgency: 'high'
  },
  {
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria.rodriguez@example.com',
    country: 'CU',
    reason: 'I need to access educational content and communicate with family members who live abroad. Internet access is very limited here.',
    urgency: 'medium'
  },
  {
    firstName: 'Kim',
    lastName: 'Jong',
    email: 'kim.jong@example.com',
    country: 'KP',
    reason: 'I need access to educational resources and information about the outside world. Internet access is heavily restricted.',
    urgency: 'high'
  },
  {
    firstName: 'Ali',
    lastName: 'Khan',
    email: 'ali.khan@example.com',
    country: 'PK',
    reason: 'I need to access social media platforms and news websites that are frequently blocked in Pakistan.',
    urgency: 'medium'
  },
  {
    firstName: 'Nguyen',
    lastName: 'Van',
    email: 'nguyen.van@example.com',
    country: 'VN',
    reason: 'I need to access independent news sources and social media platforms for my work as a blogger.',
    urgency: 'medium'
  },
  {
    firstName: 'Ahmed',
    lastName: 'Mahmoud',
    email: 'ahmed.mahmoud@example.com',
    country: 'EG',
    reason: 'I need to access social media platforms and news websites that are blocked in Egypt. I am a human rights activist.',
    urgency: 'high'
  },
  {
    firstName: 'Fatima',
    lastName: 'Al-Zahra',
    email: 'fatima.alzahra@example.com',
    country: 'SA',
    reason: 'I need to access educational resources and communicate with women\'s rights groups internationally.',
    urgency: 'medium'
  },
  {
    firstName: 'Omar',
    lastName: 'Hassan',
    email: 'omar.hassan@example.com',
    country: 'SY',
    reason: 'I need to access news sources and communicate with family members who are refugees abroad.',
    urgency: 'high'
  },
  {
    firstName: 'Leila',
    lastName: 'Mohammed',
    email: 'leila.mohammed@example.com',
    country: 'AF',
    reason: 'I need to access educational resources and communicate with international organizations for my work.',
    urgency: 'high'
  },
  {
    firstName: 'Hassan',
    lastName: 'Ali',
    email: 'hassan.ali@example.com',
    country: 'IQ',
    reason: 'I need to access social media platforms and news websites for my work as a journalist.',
    urgency: 'medium'
  },
  {
    firstName: 'Yusuf',
    lastName: 'Ibrahim',
    email: 'yusuf.ibrahim@example.com',
    country: 'TR',
    reason: 'I need to access independent news sources and social media platforms that are frequently blocked.',
    urgency: 'medium'
  },
  {
    firstName: 'Aisha',
    lastName: 'Bint',
    email: 'aisha.bint@example.com',
    country: 'AE',
    reason: 'I need to access educational resources and communicate with international women\'s groups.',
    urgency: 'low'
  },
  {
    firstName: 'Mohammed',
    lastName: 'Al-Rashid',
    email: 'mohammed.alrashid@example.com',
    country: 'KW',
    reason: 'I need to access social media platforms and news websites for my work as a blogger.',
    urgency: 'low'
  }
];

async function createSampleSponsorshipRequests() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [User, SponsorshipRequest],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established');

    const sponsorshipRequestRepository = dataSource.getRepository(SponsorshipRequest);
    const userRepository = dataSource.getRepository(User);

    // Clear existing sample data
    await sponsorshipRequestRepository.delete({});
    console.log('Cleared existing sponsorship requests');

    // Create sample users and sponsorship requests
    for (const applicant of sampleApplicants) {
      // Create user
      const user = userRepository.create({
        email: applicant.email,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        country: applicant.country,
        password: 'hashedpassword123', // This would be properly hashed in real implementation
        role: 'user',
        subscriptionPlan: 'free',
        subscriptionTier: 'free',
        isSponsored: false,
        sponsorshipEnabled: true,
        sponsorshipCount: 0,
        maxSponsorships: 1,
        subscriptionStatus: 'inactive',
        isActive: true,
        emailVerified: false,
        profilePicture: `https://ui-avatars.com/api/?name=${applicant.firstName}+${applicant.lastName}&background=random&color=fff&size=128`
      });

      const savedUser = await userRepository.save(user);

      // Create sponsorship request
      const sponsorshipRequest = sponsorshipRequestRepository.create({
        userId: savedUser.id,
        country: applicant.country,
        reason: applicant.reason,
        urgency: applicant.urgency,
        status: 'pending',
        ipAddress: '127.0.0.1',
        userAgent: 'Sample User Agent'
      });

      await sponsorshipRequestRepository.save(sponsorshipRequest);
      console.log(`Created sponsorship request for ${applicant.firstName} ${applicant.lastName}`);
    }

    console.log('Sample sponsorship requests created successfully');
  } catch (error) {
    console.error('Error creating sample sponsorship requests:', error);
  } finally {
    await dataSource.destroy();
  }
}

createSampleSponsorshipRequests();
