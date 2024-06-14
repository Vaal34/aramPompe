import React, { useState, useEffect } from 'react';

const PompeComponent = () => {
    const [pompes, setPompes] = useState(0);

    const targetPompes = 10;

    useEffect(() => {
        let interval;
        if (pompes < targetPompes) {
            const delay = 200 * (1 - pompes / targetPompes);
            interval = setTimeout(() => {
                setPompes(prevPompes => prevPompes + 1);
            }, delay);
        }

        return () => clearTimeout(interval);
    }, [pompes, targetPompes]);

    return (
        <div>
            {pompes}
        </div>
    );
};

export default PompeComponent;