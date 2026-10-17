import { css } from "lit";

export const animationStyles = css`
  @keyframes smart-ac-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes smart-ac-pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.82;
    }
    50% {
      transform: scale(1.12);
      opacity: 1;
    }
  }

  @keyframes smart-ac-glow {
    0%,
    100% {
      filter: drop-shadow(0 0 0 transparent);
    }
    50% {
      filter: drop-shadow(0 0 10px var(--smart-ac-active-color));
    }
  }

  @keyframes smart-ac-swing {
    0%,
    100% {
      transform: translateY(-2px);
    }
    50% {
      transform: translateY(2px);
    }
  }

  .animate-cool ha-icon,
  .animate-fan ha-icon {
    animation: smart-ac-spin var(--smart-ac-animation-speed, 8s) linear infinite;
  }

  .animate-heat ha-icon {
    animation: smart-ac-pulse 2.4s ease-in-out infinite;
  }

  .animate-sleep ha-icon {
    animation: smart-ac-glow 3.6s ease-in-out infinite;
  }

  .animate-swing ha-icon {
    animation: smart-ac-swing 1.8s ease-in-out infinite;
  }
`;
