import { Request, Response } from "express";
import { getUserById, updateUser, createOTPToken, getValidOTPToken, consumeOTPToken, getUserByPhone, createUser } from "../services/SupabaseService";
import { generateOTP, hashOTP, otpExpiry, formatIndianPhone, validatePhoneNumber, isOTPExpired } from "../lib/auth";
import { generateJWT } from "../lib/jwt";
import { sendOTP as sendOTPWhatsApp } from "../services/Msg91Service";

export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const user = await getUserById(req.user!.userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }
    res.json({ success: true, data: user });
  } catch (err) {
    console.error("[getProfile]", err);
    res.status(500).json({ success: false, message: "Failed to fetch profile." });
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const { name, email } = req.body as { name?: string; email?: string };
    const updated = await updateUser(req.user!.userId, { name, email });
    if (!updated) {
      res.status(500).json({ success: false, message: "Failed to update profile." });
      return;
    }
    res.json({ success: true, message: "Profile updated.", data: updated });
  } catch (err) {
    console.error("[updateProfile]", err);
    res.status(500).json({ success: false, message: "Failed to update profile." });
  }
}

export async function sendOTP(req: Request, res: Response): Promise<void> {
  try {
    const { whatsappNumber } = req.body as { whatsappNumber: string };

    if (!whatsappNumber) {
      res.status(400).json({ success: false, message: "WhatsApp number is required." });
      return;
    }

    if (!validatePhoneNumber(whatsappNumber)) {
      res.status(400).json({ success: false, message: "Enter a valid 10-digit Indian mobile number." });
      return;
    }

    const phone = formatIndianPhone(whatsappNumber);
    const otp = generateOTP();
    const hash = hashOTP(otp, phone);
    const expiresAt = otpExpiry();

    // Invalidate all existing unused OTPs for this number
    await createOTPToken(phone, hash, expiresAt);

    const sent = await sendOTPWhatsApp(phone, otp);

    if (!sent) {
      res.status(500).json({ success: false, message: "Failed to send OTP. Please try again." });
      return;
    }

    res.json({
      success: true,
      message: `OTP sent to ${phone} on WhatsApp.`,
      expiresAt,
    });
  } catch (err) {
    console.error("[sendOTP]", err);
    res.status(500).json({ success: false, message: "Failed to send OTP. Please try again." });
  }
}

export async function verifyOTP(req: Request, res: Response): Promise<void> {
  try {
    const { whatsappNumber, otp } = req.body as { whatsappNumber: string; otp: string };

    if (!whatsappNumber || !otp) {
      res.status(400).json({ success: false, message: "Phone number and OTP are required." });
      return;
    }

    if (!validatePhoneNumber(whatsappNumber)) {
      res.status(400).json({ success: false, message: "Invalid phone number format." });
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      res.status(400).json({ success: false, message: "OTP must be a 6-digit number." });
      return;
    }

    const phone = formatIndianPhone(whatsappNumber);
    const inputHash = hashOTP(otp, phone);

    // Get valid OTP token
    const tokenRow = await getValidOTPToken(phone, inputHash);

    if (!tokenRow) {
      res.status(401).json({ success: false, message: "Invalid or expired OTP. Please request a new one." });
      return;
    }

    if (isOTPExpired(tokenRow.expires_at)) {
      res.status(401).json({ success: false, message: "OTP has expired. Please request a new one." });
      return;
    }

    // Consume the token
    await consumeOTPToken(tokenRow.id);

    // Get or create user
    let user = await getUserByPhone(phone);

    if (!user) {
      user = await createUser(phone);
      if (!user) {
        res.status(500).json({ success: false, message: "Account creation failed. Please try again." });
        return;
      }
    } else {
      // Update verification status if not already verified
      if (!user.otp_verified) {
        await updateUser(user.id, { otp_verified: true, verified_at: new Date().toISOString() });
        user.otp_verified = true;
        user.verified_at = new Date().toISOString();
      }
    }

    // Issue JWT
    const jwtToken = generateJWT(user.id, user.whatsapp_number);

    res.json({
      success: true,
      message: "OTP verified successfully.",
      token: jwtToken,
      user: {
        id: user.id,
        whatsappNumber: user.whatsapp_number,
        name: user.name,
        email: user.email,
        otpVerified: user.otp_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (err) {
    console.error("[verifyOTP]", err);
    res.status(500).json({ success: false, message: "Verification failed. Please try again." });
  }
}
