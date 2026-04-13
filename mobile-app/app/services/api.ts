// If you establish a real endpoint later, place it here:
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.mockkrishieaze.com';

// Mock mode allows testing UI flows without a real server running
const MOCK_MODE = true; 

export const sendOtpRequest = async (mobileNo: string, role: string) => {
  if (MOCK_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "OTP sent successfully",
          data: {
            mobileNo: mobileNo,
            otpExpirySeconds: 300,
            nextStep: "VERIFY_OTP"
          }
        });
      }, 1000);
    });
  }

  const response = await fetch(`${API_BASE_URL}/auth/signup-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNo, role }),
  });
  return response.json();
};

export const verifyOtpRequest = async (mobileNo: string, otp: string) => {
  if (MOCK_MODE) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp === "123456") {
          resolve({
            success: true,
            message: "OTP verified",
            data: {
              isNewUser: true, // Simulating a new user to test the Register flow
              accessToken: "mock_access_token_" + Date.now(),
              refreshToken: "mock_refresh_token",
              user: {
                id: "usr_101",
                mobileNo: mobileNo,
                role: "FARMER",
                profileCompleted: false
              }
            }
          });
        } else {
          reject({
            success: false,
            message: "Invalid OTP",
            error: { code: "OTP_INVALID", status: 401 }
          });
        }
      }, 1000);
    });
  }

  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNo, otp }),
  });
  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
};

export const updateProfileRequest = async (token: string, profileData: any) => {
  if (MOCK_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Farmer profile created",
          data: {
            profileCompleted: true,
            role: "FARMER"
          }
        });
      }, 1000);
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/profile/update`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(profileData),
  });
  return response.json();
};
