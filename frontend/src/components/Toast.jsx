// src/components/Toast.jsx
import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [progress, setProgress] = useState(100);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);
            if (remaining <= 0) {
                clearInterval(interval);
                setVisible(false);
                setTimeout(onClose, 300); // даём анимацию
            }
        }, 16);
        return () => clearInterval(interval);
    }, [duration, onClose]);

    if (!visible) return null;

    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const borderColor = type === 'success' ? 'border-green-500' : 'border-red-500';

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div className={`relative bg-white rounded-lg shadow-lg border-l-4 ${borderColor} overflow-hidden min-w-[280px] max-w-sm`}>
                {/* Прогресс-полоса сверху или снизу */}
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-200">
                    <div
                        className={`h-full ${bgColor}`}
                        style={{ width: `${progress}%`, transition: 'width 0.016s linear' }}
                    />
                </div>
                <div className="p-4 pr-10">
                    <p className="text-gray-800">{message}</p>
                    <button
                        onClick={() => {
                            setVisible(false);
                            onClose();
                        }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast;