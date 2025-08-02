import { NextResponse } from 'next/server';

// 10 stock interview/assessment questions
const stockQuestions = [
  {
    id: 1,
    question: "Tell me about yourself and your background.",
    category: "Introduction",
    expectedPoints: ["Professional background", "Key achievements", "Current role/goals", "Personal motivation"]
  },
  {
    id: 2,
    question: "Describe a challenging project you worked on and how you overcame the obstacles.",
    category: "Problem Solving",
    expectedPoints: ["Clear problem identification", "Solution approach", "Implementation steps", "Results achieved"]
  },
  {
    id: 3,
    question: "How do you handle working under pressure and tight deadlines?",
    category: "Stress Management",
    expectedPoints: ["Specific strategies", "Prioritization methods", "Time management", "Examples of success"]
  },
  {
    id: 4,
    question: "Describe a time when you had to work with a difficult team member. How did you handle it?",
    category: "Teamwork",
    expectedPoints: ["Conflict resolution", "Communication skills", "Empathy", "Professional approach"]
  },
  {
    id: 5,
    question: "What are your greatest strengths and how do they apply to this role?",
    category: "Self-Assessment",
    expectedPoints: ["Self-awareness", "Relevant skills", "Specific examples", "Role alignment"]
  },
  {
    id: 6,
    question: "Tell me about a time you had to learn something completely new. How did you approach it?",
    category: "Learning Ability",
    expectedPoints: ["Learning strategy", "Resourcefulness", "Persistence", "Application of knowledge"]
  },
  {
    id: 7,
    question: "How do you prioritize tasks when everything seems urgent?",
    category: "Time Management",
    expectedPoints: ["Decision-making process", "Criteria for prioritization", "Communication with stakeholders", "Practical examples"]
  },
  {
    id: 8,
    question: "Describe a situation where you had to give difficult feedback to someone.",
    category: "Leadership",
    expectedPoints: ["Preparation approach", "Delivery method", "Empathy and respect", "Follow-up actions"]
  },
  {
    id: 9,
    question: "What motivates you in your work, and how do you stay engaged during routine tasks?",
    category: "Motivation",
    expectedPoints: ["Intrinsic motivation", "Goal alignment", "Engagement strategies", "Personal drive"]
  },
  {
    id: 10,
    question: "Where do you see yourself in 5 years, and how does this opportunity align with your goals?",
    category: "Future Vision",
    expectedPoints: ["Clear vision", "Realistic goals", "Career planning", "Role relevance"]
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count')) || 10;
    const category = searchParams.get('category');
    const random = searchParams.get('random') === 'true';

    let questions = [...stockQuestions];

    // Filter by category if specified
    if (category) {
      questions = questions.filter(q => 
        q.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Get random subset if requested
    if (random && count < questions.length) {
      questions = questions
        .sort(() => Math.random() - 0.5)
        .slice(0, count);
    } else if (count < questions.length) {
      questions = questions.slice(0, count);
    }

    return NextResponse.json({
      success: true,
      questions,
      totalAvailable: stockQuestions.length,
      categories: [...new Set(stockQuestions.map(q => q.category))]
    });

  } catch (error) {
    console.error('Questions API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { action, questionId, customQuestion } = await request.json();

    if (action === 'add-custom') {
      // In a real app, you'd save this to a database
      const newQuestion = {
        id: stockQuestions.length + 1,
        question: customQuestion,
        category: "Custom",
        expectedPoints: ["Custom question - evaluate based on content and delivery"]
      };

      return NextResponse.json({
        success: true,
        message: 'Custom question added',
        question: newQuestion
      });
    }

    if (action === 'get-single' && questionId) {
      const question = stockQuestions.find(q => q.id === parseInt(questionId));
      if (!question) {
        return NextResponse.json(
          { error: 'Question not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        question
      });
    }

    return NextResponse.json(
      { error: 'Invalid action or missing parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Questions API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
