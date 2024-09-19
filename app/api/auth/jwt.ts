export const fetcher = async (url : any, token : any) => {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
  
    return response.json();
  };