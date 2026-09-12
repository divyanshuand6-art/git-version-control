import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./createRepository.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3002";

const CreateRepository = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateRepository = async (e) => {
   console.log("Create repository button clicked");
    

    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("User ID not found. Please login again.");
      return;
    }

    if (!name.trim()) {
      setError("Repository name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/repo/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: userId,
          name: name.trim(),
          description: description.trim(),
          visibility,
          content: [],
          issues: [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create repository.");
      }

      navigate("/");
    } catch (err) {
      console.error("Error creating repository:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="create-repo-page">
        <div className="create-repo-card">
          <h1>Create a new repository</h1>

          <p className="create-repo-subtitle">
            Create a repository to start managing your project.
          </p>

          <form onSubmit={handleCreateRepository}>
            <label htmlFor="repo-name">Repository name</label>

            <input
              id="repo-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-project"
              autoComplete="off"
            />

            <label htmlFor="repo-description">Description</label>

            <textarea
              id="repo-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of your repository"
              rows="5"
            />

            <div className="visibility-section">
              <label>Visibility</label>

              <div className="visibility-options">
                <label>
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === true}
                    onChange={() => setVisibility(true)}
                  />
                  Public
                </label>

                <label>
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === false}
                    onChange={() => setVisibility(false)}
                  />
                  Private
                </label>
              </div>
            </div>

            {error && <p className="create-repo-error">{error}</p>}

            <div className="create-repo-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="create-btn"
                disabled={loading}
                  onClick={handleCreateRepository}

              >
                {loading ? "Creating..." : "Create repository"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRepository;