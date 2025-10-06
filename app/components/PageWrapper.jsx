"use client";

import ProtectedLayout from "./ProtectedLayout";

const PageWrapper = ({ children }) => {
    return (
        <ProtectedLayout>
            {children}
        </ProtectedLayout>
    );
};

export default PageWrapper;