import { Ionicons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import images from "@/constants/images";
import { login, signIn, signUp } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";

const SignIn = () => {
  const { loading, isLoggedIn, setSession } = useGlobalContext();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!loading && isLoggedIn) return <Redirect href="/" />;

  const validateForm = () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all required fields");
      return false;
    }
    if (isSignUp && !form.name) {
      Alert.alert("Error", "Please enter your name");
      return false;
    }
    if (form.password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return false;
    }
    return true;
  };
  const handleEmailAuth = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let result;
      if (isSignUp) {
        result = await signUp(form.email, form.password, form.name);
      } else {
        result = await signIn(form.email, form.password);
      }

      if (result) {
        setSession(result);
        Alert.alert(
          "Success",
          isSignUp ? "Account created successfully!" : "Signed in successfully!"
        );
      }
    } catch (error: any) {
      console.error("Email auth error:", error);

      // Show user-friendly error message
      const errorMessage =
        error.message || "Authentication failed. Please try again.";

      // For signup errors suggesting the user already has an account
      if (isSignUp && errorMessage.includes("already exists")) {
        Alert.alert(
          "Account Already Exists",
          "An account with this email already exists. Would you like to sign in instead?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Sign In",
              onPress: () => {
                setIsSignUp(false);
                setForm({ ...form, name: "" }); // Clear name field
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    try {
      const result = await login();
      if (result) {
        setSession(result);
      } else {
        Alert.alert("Error", "Google authentication failed");
      }
    } catch (error: any) {
      console.error("Google auth error:", error);
      Alert.alert("Error", error.message || "Google authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-7">
          {/* Header */}
          <View className="items-center mt-8 mb-10">
            <Image
              source={images.logo}
              className="w-20 h-20 mb-4"
              resizeMode="contain"
            />
            <Text className="text-3xl font-rubik-bold text-black-300 text-center mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </Text>
            <Text className="text-base font-rubik text-black-200 text-center">
              {isSignUp
                ? "Join us and find your dream home"
                : "Sign in to continue your property search"}
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Name Field (Sign Up Only) */}
            {isSignUp && (
              <View>
                <Text className="text-base font-rubik-medium text-black-300 mb-2">
                  Full Name
                </Text>
                <View className="bg-accent-100 rounded-xl border border-primary-100 px-4 py-4">
                  <TextInput
                    value={form.name}
                    onChangeText={(text) => setForm({ ...form, name: text })}
                    placeholder="Enter your full name"
                    placeholderTextColor="#9CA3AF"
                    className="font-rubik text-black-300"
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            {/* Email Field */}
            <View>
              <Text className="text-base font-rubik-medium text-black-300 mb-2">
                Email Address
              </Text>
              <View className="bg-accent-100 rounded-xl border border-primary-100 px-4 py-4">
                <TextInput
                  value={form.email}
                  onChangeText={(text) => setForm({ ...form, email: text })}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  className="font-rubik text-black-300"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Field */}
            <View>
              <Text className="text-base font-rubik-medium text-black-300 mb-2">
                Password
              </Text>
              <View className="bg-accent-100 rounded-xl border border-primary-100 px-4 py-4 flex-row items-center">
                <TextInput
                  value={form.password}
                  onChangeText={(text) => setForm({ ...form, password: text })}
                  placeholder={
                    isSignUp
                      ? "Create a password (min 8 chars)"
                      : "Enter your password"
                  }
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 font-rubik text-black-300"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-2"
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Email Auth Button */}
            <TouchableOpacity
              onPress={handleEmailAuth}
              disabled={isSubmitting}
              className={`bg-primary-300 rounded-xl py-4 mt-6 ${
                isSubmitting ? "opacity-50" : ""
              }`}
            >
              <Text className="text-white text-center font-rubik-semibold text-lg">
                {isSubmitting
                  ? "Please wait..."
                  : isSignUp
                  ? "Create Account"
                  : "Sign In"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-black-100" />
              <Text className="mx-4 text-black-200 font-rubik">or</Text>
              <View className="flex-1 h-px bg-black-100" />
            </View>

            {/* Google Auth Button */}
            <TouchableOpacity
              onPress={handleGoogleAuth}
              disabled={isSubmitting}
              className={`bg-white border border-black-100 rounded-xl py-4 flex-row items-center justify-center ${
                isSubmitting ? "opacity-50" : ""
              }`}
            >
              <Image
                source={images.google}
                className="w-5 h-5 mr-3"
                resizeMode="contain"
              />
              <Text className="text-black-300 font-rubik-semibold text-lg">
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Toggle Sign In/Up */}
            <View className="flex-row justify-center mt-8 mb-4">
              <Text className="text-black-200 font-rubik">
                {isSignUp
                  ? "Already have an account? "
                  : "Don't have an account? "}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  setForm({ name: "", email: "", password: "" });
                }}
                disabled={isSubmitting}
              >
                <Text className="text-primary-300 font-rubik-semibold">
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
