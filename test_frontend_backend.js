import fetch from 'node-fetch';

async function testFrontendBackendConnection() {
  console.log('🧪 Testing Frontend-Backend Connection...\n');

  try {
    // Test the exact API call that the frontend makes
    const frontendRequest = {
      studentData: {
        SEE_GPA: ">3.6",
        SEE_Science_GPA: ">3.6", 
        SEE_Math_GPA: ">3.6",
        Fee: "High",
        Hostel: "Yes",
        Transportation: "Yes",
        ECA: "Strong",
        Scholarship: "Yes",
        Science_Labs: "Good",
        Infrastructure: "Excellent"
      },
      datasetName: "see"
    };

    console.log('📤 Frontend Request:');
    console.log(JSON.stringify(frontendRequest, null, 2));

    const response = await fetch('http://localhost:5000/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(frontendRequest)
    });

    console.log('\n📥 Response Status:', response.status);
    console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    
    console.log('\n📥 Response Body:');
    console.log(JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('\n✅ Frontend-Backend connection successful!');
      console.log(`🎯 Predicted Tier: ${result.recommendations.tier}`);
      console.log(`🎯 Predicted College: ${result.recommendations.college}`);
    } else {
      console.log('\n❌ Frontend-Backend connection failed:', result.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testFrontendBackendConnection();
