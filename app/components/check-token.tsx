async function CheckToken() {
  const res = await fetch("/api/check-token", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status == 200) {
    return true;
  } else {
    return false;
  }
}

export default CheckToken;
