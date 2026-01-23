"use client";

import React from "react";

// Minimal replacement for ErrorState as requested
const ErrorState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

const ErrorPage = () => {
  return (
    <ErrorState
      title="Error Loading Agents"
      description="Something went wrong"
    />
  );
};

export default ErrorPage;
