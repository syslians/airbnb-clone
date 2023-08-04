'use client';

import { useEffect } from "react";
import EmptyState from "./components/EmptyState";

interface ErrorStateProps {
    error: Error
}

const ErrorState: React.FC<ErrorStateProps> = ({
  error
}) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
      <EmptyState 
        title="앗 이런!"
        subtitle="뭔가가 잘못된것 같군요."
      />  
    )
}

export default ErrorState;