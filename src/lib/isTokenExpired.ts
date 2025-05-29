export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000); 
    const timeRemaining = payload.exp - currentTime;

    const secondsRemaining = timeRemaining;
    const minutesRemaining = Math.floor(secondsRemaining / 60);
    const secondsOnly = secondsRemaining % 60;

    console.log(`Token expires in: ${minutesRemaining} mins, ${secondsOnly} secs`);
    
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Tokenni ochishda xatolik:", error);
    return true; 
  }
}

  