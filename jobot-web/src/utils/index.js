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
