export const verifyJWT = async (jwt) => {
  const response = await fetch('/api/v1/validate', {
    headers: { 'Accept': 'application/json', 'Content-type': 'application/json', 'Authorization': `Bearer ${jwt}` },
    method: 'GET',
  });

  return response.ok;
};
