module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pinkGradient: {
          from: "#FA1214", // Starting color at 0%
          via: "#FE3A82", // Middle color at 48%
          to: "#D2006D", // Ending color at 100%
        },
        blackScale: {
          light: "#E5E5E5", // Lightest gray (e.g., background)
          muted: "#AAAAAA", // Muted gray (e.g., lines in forms)
          mid: "#808080", // Mid-gray (e.g., secondary text)
          dark: "#555555", // Dark gray (e.g., main text in cards)
          darker: "#2B2B2B", // Darker gray (e.g., headers or strong emphasis)
          input: "#B0ADAD", // Input text or placeholder
          border: "#E8E8E8", // Border colors for input/cards
        },
        complementaryColors: {
          // Status Colors
          statusSuccess: "#1D9E33", // Approved
          statusProcessing: "#EAA221", // Awaiting Approval
          statusWarning: "#F42828", // Not Submitted
        }
      },
      
      backgroundImage: {
        pinkGradient: "linear-gradient(to bottom, #FA1214 80%, #FE3A82, #D2006D 80%)",
      },
      
      fontFamily: {
        sans: ["Inter", "sans-serif"], 
      }      
    },
  },
  plugins: [],
};
