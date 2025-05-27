// BETA, check for browser
export default parseUserAgent = (uaString = navigator.userAgent) => {
    const ua = uaString.toLowerCase();
  
    // 檢查平台
    const os = (() => {
      if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'iOS';
      if (ua.includes('android')) return 'Android';
      if (ua.includes('macintosh') || ua.includes('mac os x')) return 'macOS';
      if (ua.includes('windows')) return 'Windows';
      return 'other';
    })();
  
    // 檢查是否為手機
    const mobile = /mobile|iphone|android/.test(ua);
  
    // 檢查瀏覽器
    const browser = (() => {
      if (/edga\//.test(ua)) return 'Edge'; // Edge on Android
      if (/edg\//.test(ua)) return 'Edge'; // Edge on Windows
      if (/firefox\//.test(ua)) return 'Firefox';
      if (/safari/.test(ua) && /version/.test(ua) && !/chrome|crios|edg\//.test(ua)) return 'Safari';
      if (/chrome\//.test(ua) && !/edg\//.test(ua)) return 'Chrome';
      return 'other';
    })();
  
    return { os, browser, mobile };
}
