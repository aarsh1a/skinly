import React from 'react';
import Svg, { Path, Circle, G, Ellipse, Line } from 'react-native-svg';

// Acne-prone skin icon (dots on face outline)
export const AcneIcon = ({ size = 20, color = '#f9a8d4' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="10" r="7" stroke={color} strokeWidth="1.5" fill="none" />
        <Circle cx="9" cy="9" r="1.2" fill={color} />
        <Circle cx="14" cy="8" r="1" fill={color} />
        <Circle cx="11" cy="12" r="0.8" fill={color} />
        <Circle cx="15" cy="11" r="1.1" fill={color} />
        <Path d="M8 17 C8 17 10 20 12 20 C14 20 16 17 16 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
);

// Combination skin icon (half oily, half dry)
export const CombinationIcon = ({ size = 20, color = '#a5b4fc' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none" />
        <Path d="M12 3 L12 21" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
        <Circle cx="8" cy="10" r="1.5" fill={color} fillOpacity="0.5" />
        <Circle cx="8" cy="14" r="1.2" fill={color} fillOpacity="0.5" />
        <Path d="M15 9 Q17 12 15 15" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
);

// Breakouts / Flash icon
export const BreakoutIcon = ({ size = 16, color = '#fcd34d' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={color}
            fillOpacity="0.2"
        />
    </Svg>
);

// Sensitivity / Leaf icon
export const SensitivityIcon = ({ size = 16, color = '#86efac' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 22C12 22 4 16 4 10C4 6 8 2 12 2C16 2 20 6 20 10C20 16 12 22 12 22Z"
            stroke={color}
            strokeWidth="1.5"
            fill={color}
            fillOpacity="0.15"
        />
        <Path d="M12 22V10" stroke={color} strokeWidth="1.2" />
        <Path d="M12 14L9 11" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <Path d="M12 12L15 9" stroke={color} strokeWidth="1" strokeLinecap="round" />
    </Svg>
);

// Routine / Clock icon
export const RoutineIcon = ({ size = 16, color = 'rgba(255,255,255,0.5)' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none" />
        <Path d="M12 6V12L16 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// Oily skin icon (droplet)
export const OilyIcon = ({ size = 20, color = '#93c5fd' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 2C12 2 6 10 6 14C6 17.314 8.686 20 12 20C15.314 20 18 17.314 18 14C18 10 12 2 12 2Z"
            stroke={color}
            strokeWidth="1.5"
            fill={color}
            fillOpacity="0.2"
        />
    </Svg>
);

// Dry skin icon (cracked surface)
export const DryIcon = ({ size = 20, color = '#fdba74' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none" />
        <Path d="M8 8L10 12L8 16" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <Path d="M12 6L12 10L14 14L12 18" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <Path d="M16 8L14 12L16 16" stroke={color} strokeWidth="1" strokeLinecap="round" />
    </Svg>
);

// Sensitive skin icon (feather)
export const FeatherIcon = ({ size = 20, color = '#fca5a5' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M20 4L4 20M20 4C20 4 16 4 12 8C8 12 4 20 4 20M20 4C20 4 20 8 16 12"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        <Path d="M14 10L10 14" stroke={color} strokeWidth="1" strokeLinecap="round" />
    </Svg>
);

// Normal skin / Balance icon
export const BalanceIcon = ({ size = 20, color = '#a7f3d0' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 3V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M5 8L12 5L19 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="5" cy="11" r="2.5" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.2" />
        <Circle cx="19" cy="11" r="2.5" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.2" />
    </Svg>
);

// Skinly Avatar - Cute face icon for AI assistant
export const SkinlyAvatar = ({ size = 24, color = '#EC4899' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Face outline */}
        <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15" />
        {/* Eyes - cute closed happy eyes */}
        <Path d="M7 11C7 11 8 9 9.5 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M14.5 11C14.5 11 15.5 9 17 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {/* Blush circles */}
        <Circle cx="6.5" cy="13" r="1.2" fill={color} fillOpacity="0.3" />
        <Circle cx="17.5" cy="13" r="1.2" fill={color} fillOpacity="0.3" />
        {/* Happy smile */}
        <Path d="M9 15C9 15 10.5 17 12 17C13.5 17 15 15 15 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {/* Sparkle on top */}
        <Path d="M18 4L18.5 5.5L20 6L18.5 6.5L18 8L17.5 6.5L16 6L17.5 5.5L18 4Z" fill={color} />
    </Svg>
);

// Chat bubble icon with heart - for skincare chat
export const SkinlyChatIcon = ({ size = 20, color = '#EC4899' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Chat bubble */}
        <Path
            d="M21 11.5C21 16.19 16.97 20 12 20C10.89 20 9.82 19.82 8.83 19.5L4 21L5.39 17.36C3.89 15.85 3 13.77 3 11.5C3 6.81 7.03 3 12 3C16.97 3 21 6.81 21 11.5Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={color}
            fillOpacity="0.1"
        />
        {/* Heart inside */}
        <Path
            d="M12 14L10.5 12.5C9.5 11.5 9.5 10 10.5 9.5C11.2 9.1 12 9.5 12 9.5C12 9.5 12.8 9.1 13.5 9.5C14.5 10 14.5 11.5 13.5 12.5L12 14Z"
            fill={color}
        />
    </Svg>
);

// Serum/Dropper bottle icon
export const SerumIcon = ({ size = 20, color = '#EC4899' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 2L12 5"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        <Path
            d="M9 5H15V7C15 7 17 8 17 11V19C17 20.1 16.1 21 15 21H9C7.9 21 7 20.1 7 19V11C7 8 9 7 9 7V5Z"
            stroke={color}
            strokeWidth="1.5"
            fill={color}
            fillOpacity="0.15"
        />
        <Circle cx="12" cy="14" r="2" fill={color} fillOpacity="0.4" />
    </Svg>
);

export default {
    AcneIcon,
    CombinationIcon,
    BreakoutIcon,
    SensitivityIcon,
    RoutineIcon,
    OilyIcon,
    DryIcon,
    FeatherIcon,
    BalanceIcon,
    SkinlyAvatar,
    SkinlyChatIcon,
    SerumIcon,
};

