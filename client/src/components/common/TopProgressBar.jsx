import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const TopProgressBar = () => {
    const location = useLocation();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Start animation whenever the path changes
        setVisible(true);
        setProgress(30);
        const timer1 = setTimeout(() => setProgress(70), 200);
        const timer2 = setTimeout(() => setProgress(90), 500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [location.pathname]);   // trigger on any route change

    // When progress hits 100, hide the bar after a short delay
    useEffect(() => {
        if (progress === 90) {
            const timer = setTimeout(() => {
                setProgress(100);
                setTimeout(() => {
                    setVisible(false);
                    setProgress(0);
                }, 300);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [progress]);

    if (!visible) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-[9999]">
            <div
                className="h-full bg-brand transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default TopProgressBar;