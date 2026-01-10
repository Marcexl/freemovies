import { useBreakpoints } from '@vueuse/core'

export const breakpointsOptions = {
    desktop: 1600,
    laptop: 1400,
    tabletHorizontal: 1100,
    tabletVertical: 768,
    mobile: 500,
}

export const useCustomBreakpoints = () => {
    const breakpoints = useBreakpoints(breakpointsOptions)
    return {
        breakpoints,
    }
}