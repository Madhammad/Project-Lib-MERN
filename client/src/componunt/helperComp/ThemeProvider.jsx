import PropTypes from "prop-types"; 
import { useSelector } from "react-redux";

export default function ThemeProvider({ children }) {
  
  const { theme } = useSelector((state) => state.theme);


  
  return (
    <div className={theme}>
      <div className="bg-slate-200 text-gray-700 dark:text-gray-200 dark:bg-slate-700 min-h-screen">
        {children}
      </div>
    </div>
  );
}


ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
