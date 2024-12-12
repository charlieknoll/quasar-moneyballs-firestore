import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { Dialog } from "quasar";

import { supabase } from "src/supabase/supabase";
import { useStoreEntries } from "src/stores/storeEntries";

let authCallback = null;

export const useStoreAuth = defineStore("auth", () => {
  /*
    state
  */

  const userDetailsDefault = {
    id: null,
    email: null,
    refreshToken: null,
  };

  const userDetails = reactive({
    ...userDetailsDefault,
  });

  const authInitialized = ref(false);
  /*
    actions
  */

  const init = () => {
    const router = useRouter(),
      storeEntries = useStoreEntries();
    const setUserData = async (session) => {
      console.log("setUserData", userDetails, session);
      userDetails.email = session.user.email;
      userDetails.refreshToken = session.refresh_token;
      if (userDetails.id === null || userDetails.id !== session.user.id) {
        userDetails.id = session.user.id;
        storeEntries.init();
      }
      //console.log("router.currentRoute.value", router.currentRoute.value);
      if (router.currentRoute.value.fullPath == "/auth") {
        router.push("/");
      }
      authInitialized.value = true;
    };
    const clearUserData = () => {
      console.log("clearUserData");
      Object.assign(userDetails, userDetailsDefault);
      router.replace("/auth");
      storeEntries.clearAndStopEntries();
    };
    if (authCallback) authCallback.subscription.unsubscribe();
    authCallback = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      if (
        event === "INITIAL_SESSION" ||
        event === "USER_UPDATED" ||
        event === "SIGNED_IN"
      ) {
        if (session) {
          setUserData(session);
        } else {
          clearUserData();
        }
      } else if (event === "SIGNED_OUT") {
        clearUserData();
        // handle sign out event
      } else if (event === "PASSWORD_RECOVERY") {
        // handle password recovery event
      } else if (event === "TOKEN_REFRESHED") {
        // handle token refreshed event
        userDetails.refreshToken = session.refresh_token;
      } else if (event === "USER_UPDATED") {
        // handle user updated event
        userDetails.email = session.user.email;
      }
    });
  };

  const registerUser = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) showError(error.message);
  };

  const loginUser = async ({ email, password }) => {
    console.log("login");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) showError(error.message);
    console.log("data", data);
  };

  const logoutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) showError(error.message);
  };

  /*
    helpers
  */

  const showError = (message) => {
    Dialog.create({
      title: "Error",
      message,
    });
  };

  /*
    return
  */

  return {
    // state
    userDetails,
    authInitialized,

    // actions
    init,
    registerUser,
    loginUser,
    logoutUser,
  };
});
