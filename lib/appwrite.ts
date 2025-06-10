import { makeRedirectUri } from "expo-auth-session";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { Platform } from "react-native";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  OAuthProvider,
  Query,
  type Models,
} from "react-native-appwrite";

// Custom user type that includes the avatar property
export type UserWithAvatar = Models.User<Models.Preferences> & {
  avatar: string;
};

export const config = {
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
  galleriesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
  propertiesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

// Email/Password Authentication Functions
export async function signUp(email: string, password: string, name: string) {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) throw new Error("Failed to create account");

    // Automatically sign in after successful signup
    const session = await signIn(email, password);
    return session;
  } catch (error: any) {
    console.error("Sign up error:", error);

    // Handle specific Appwrite error codes
    if (error.code === 409) {
      throw new Error(
        "An account with this email already exists. Please sign in instead."
      );
    } else if (error.code === 400) {
      if (error.message?.includes("password")) {
        throw new Error(
          "Password must be at least 8 characters long and contain a mix of characters."
        );
      } else if (error.message?.includes("email")) {
        throw new Error("Please enter a valid email address.");
      } else {
        throw new Error("Please check your input and try again.");
      }
    } else if (error.code === 429) {
      throw new Error(
        "Too many attempts. Please wait a moment before trying again."
      );
    } else {
      throw new Error("Failed to create account. Please try again.");
    }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    if (!session) throw new Error("Failed to create session");

    console.log("✅ Email session created successfully:", session.$id);
    return session;
  } catch (error: any) {
    console.error("Sign in error:", error);

    // Handle specific Appwrite error codes
    if (error.code === 401) {
      throw new Error(
        "Invalid email or password. Please check your credentials and try again."
      );
    } else if (error.code === 400) {
      throw new Error("Please enter a valid email and password.");
    } else if (error.code === 429) {
      throw new Error(
        "Too many login attempts. Please wait a moment before trying again."
      );
    } else {
      throw new Error("Failed to sign in. Please try again.");
    }
  }
}

// Google OAuth Login (preserved)
export async function login() {
  try {
    // Creates a success redirect url after authentication is successful
    let redirectUri: string;

    if (Platform.OS === "web") {
      redirectUri = Linking.createURL("/");

      console.log("Platform:", Platform.OS);
      console.log("Redirect URI:", redirectUri);
      // Use createOAuth2Session for web
      const response = account.createOAuth2Session(
        OAuthProvider.Google,
        redirectUri,
        redirectUri
      );

      if (!response) throw new Error("Failed to create OAuth2 session");

      const browserResult = await openAuthSessionAsync(
        response.toString(),
        redirectUri
      );

      if (browserResult.type !== "success") {
        throw new Error("OAuth authentication was cancelled or failed");
      }

      // For web, session is automatically created
      const currentSession = await account.getSession("current");
      if (!currentSession) {
        throw new Error("No session found after OAuth authentication");
      }
      return currentSession;
    } else {
      redirectUri = makeRedirectUri({
        scheme: "urbanhomes",
        path: "/",
      });

      console.log("Platform: ", Platform.OS);
      console.log("redirectUri: ", redirectUri);
      // Use createOAuth2Token for android and ios to ensure cookies
      // are shared between app and in-app browser after redirection
      const response = account.createOAuth2Token(
        OAuthProvider.Google,
        redirectUri
      );
      if (!response) throw new Error("Create OAuth2 token failed");

      const browserResult = await openAuthSessionAsync(
        response.toString(),
        redirectUri
      );

      if (browserResult.type !== "success")
        throw new Error("Create OAuth2 token failed");

      console.log("Browser Result: ", browserResult);

      const url = new URL(browserResult.url);
      const secret = url.searchParams.get("secret")?.toString();
      const userId = url.searchParams.get("userId")?.toString();
      if (!secret || !userId) throw new Error("Create OAuth2 token failed");

      // Create session manually using userId and secret
      await account.createSession(userId, secret);

      // Return the newly created session
      const currentSession = await account.getSession("current");
      if (!currentSession) {
        throw new Error("Failed to create session after OAuth authentication");
      }
      return currentSession;
    }
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

export async function logout() {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentUser(): Promise<UserWithAvatar | null> {
  try {
    const response = await account.get();

    if (response.$id) {
      // generate a new user avatar
      const userAvatar = avatar.getInitials(response.name);
      const userData: UserWithAvatar = {
        ...response,
        avatar: userAvatar.toString(),
      };
      return userData;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function getCurrentSession() {
  try {
    return await account.getSession("current");
  } catch (error) {
    console.error("No current session:", error);
    return null;
  }
}

export async function getLatestProperties() {
  try {
    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      [Query.orderAsc("$createdAt"), Query.limit(5)]
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "All")
      buildQuery.push(Query.equal("type", filter));

    if (query)
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ])
      );

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      buildQuery
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPropertyById({ id }: { id: string }) {
  try {
    const result = await databases.getDocument(
      config.databaseId!,
      config.propertiesCollectionId!,
      id
    );

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
