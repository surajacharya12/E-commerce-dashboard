"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const Toast = ({ message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const Icon = type === 'success' ? CheckCircle : XCircle;

    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 max-w-sm`}>
            <Icon className="h-5 w-5" />
            <span className="flex-1">{message}</span>
            <button
                onClick={onClose}
                className="text-white hover:text-gray-200"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default Toast;