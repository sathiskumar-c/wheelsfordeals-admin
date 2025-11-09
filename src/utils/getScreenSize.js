// Screen Size Utility Functions

// Breakpoint constants
export const BREAKPOINTS = {
    MOBILE_MAX: 767.98,
    TABLET_MIN: 768,
    TABLET_MAX: 991.98,
    DESKTOP_MIN: 992,
    LARGE_DESKTOP_MIN: 1200,
};

// Device type constants
export const DEVICE_TYPES = {
    MOBILE: 'mobile',
    TABLET: 'tablet',
    DESKTOP: 'desktop',
    LARGE_DESKTOP: 'large-desktop',
};

export const getDeviceType = (width = typeof window !== 'undefined' ? window.innerWidth : 0) => {
    if (width <= BREAKPOINTS.MOBILE_MAX) {
        return DEVICE_TYPES.MOBILE;
    } else if (width >= BREAKPOINTS.TABLET_MIN && width <= BREAKPOINTS.TABLET_MAX) {
        return DEVICE_TYPES.TABLET;
    } else if (width >= BREAKPOINTS.DESKTOP_MIN && width < BREAKPOINTS.LARGE_DESKTOP_MIN) {
        return DEVICE_TYPES.DESKTOP;
    } else {
        return DEVICE_TYPES.LARGE_DESKTOP;
    }
};

export const isMobile = (width) => getDeviceType(width) === DEVICE_TYPES.MOBILE;

export const isTablet = (width) => getDeviceType(width) === DEVICE_TYPES.TABLET;

export const isDesktop = (width) => {
    const deviceType = getDeviceType(width);
    return deviceType === DEVICE_TYPES.DESKTOP || deviceType === DEVICE_TYPES.LARGE_DESKTOP;
};

export const isMobileOrTablet = (width) => {
    const deviceType = getDeviceType(width);
    return deviceType === DEVICE_TYPES.MOBILE || deviceType === DEVICE_TYPES.TABLET;
};

export const getScreenInfo = () => {
    if (typeof window === 'undefined') {
        return {
            width: 0,
            height: 0,
            deviceType: DEVICE_TYPES.DESKTOP,
            isMobile: false,
            isTablet: false,
            isDesktop: true,
            isMobileOrTablet: false,
        };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const deviceType = getDeviceType(width);

    return {
        width,
        height,
        deviceType,
        isMobile: deviceType === DEVICE_TYPES.MOBILE,
        isTablet: deviceType === DEVICE_TYPES.TABLET,
        isDesktop: deviceType === DEVICE_TYPES.DESKTOP || deviceType === DEVICE_TYPES.LARGE_DESKTOP,
        isMobileOrTablet: deviceType === DEVICE_TYPES.MOBILE || deviceType === DEVICE_TYPES.TABLET,
    };
};

export const getDeviceFlags = () => {
    const deviceType = getDeviceType();

    return {
        isMobile: deviceType === DEVICE_TYPES.MOBILE,
        isTablet: deviceType === DEVICE_TYPES.TABLET,
        isDesktop: deviceType === DEVICE_TYPES.DESKTOP || deviceType === DEVICE_TYPES.LARGE_DESKTOP,
        isMobileOrTablet: deviceType === DEVICE_TYPES.MOBILE || deviceType === DEVICE_TYPES.TABLET,
        deviceType,
    };
};

export const matchesMediaQuery = (query) => {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return false;
    }
    return window.matchMedia(query).matches;
};

export const mediaQueries = {
    isMobile: () => matchesMediaQuery(`(max-width: ${BREAKPOINTS.MOBILE_MAX}px)`),
    isTablet: () => matchesMediaQuery(`(min-width: ${BREAKPOINTS.TABLET_MIN}px) and (max-width: ${BREAKPOINTS.TABLET_MAX}px)`),
    isDesktop: () => matchesMediaQuery(`(min-width: ${BREAKPOINTS.DESKTOP_MIN}px)`),
    isMobileOrTablet: () => matchesMediaQuery(`(max-width: ${BREAKPOINTS.TABLET_MAX}px)`),
    isLargeDesktop: () => matchesMediaQuery(`(min-width: ${BREAKPOINTS.LARGE_DESKTOP_MIN}px)`),
};

export const createScreenSizeListener = (callback, throttleMs = 100) => {
    let timeoutId = null;

    const handleResize = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            const screenInfo = getScreenInfo();
            callback(screenInfo);
        }, throttleMs);
    };

    const startListening = () => {
        window.addEventListener('resize', handleResize, { passive: true });
    };

    const stopListening = () => {
        window.removeEventListener('resize', handleResize);
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    return {
        startListening,
        stopListening,
        getCurrentScreenInfo: getScreenInfo
    };
};

export default {
    getDeviceType,
    isMobile,
    isTablet,
    isDesktop,
    isMobileOrTablet,
    getScreenInfo,
    getDeviceFlags,
    createScreenSizeListener,
    matchesMediaQuery,
    mediaQueries,
    BREAKPOINTS,
    DEVICE_TYPES,
};
