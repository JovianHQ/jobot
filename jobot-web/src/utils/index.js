import { useRouter } from "next/router";

export function makeDisplayName(profile) {
  if (profile.first_name && profile.last_name) {
    return `${profile.first_name} ${profile.last_name}`;
  } else {
    return profile.first_name;
  }
}

export function isJson(myVar) {
  if (typeof myVar === "object" && myVar !== null) {
    return true;
  } else {
    return false;
  }
}

export function useLoginDialog() {
  const router = useRouter();
  const { action } = router.query;
  const isLoginOpen = action === "login";
  const setLoginOpen = (open) => {
    const query = { ...router.query };

    if (!open && query.action === "login") {
      delete query.action;
    }

    if (open) {
      query.action = "login";
    }

    router.push({
      pathname: router.pathname,
      query,
    });
  };

  return { isLoginOpen, setLoginOpen };
}
