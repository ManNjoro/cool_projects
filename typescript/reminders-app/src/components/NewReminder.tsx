import React, { useState } from "react";

interface NewReminderProps {
  onAddReminder: (title: string) => void;
}

export default function NewReminder({
  onAddReminder,
}: NewReminderProps): React.JSX.Element {
  const [title, setTitle] = useState("");

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onAddReminder(title);
    setTitle("");
  };
  return (
    <form onSubmit={submitForm}>
      <label htmlFor="title"></label>
      <input
        id="title"
        type="text"
        className="form-control"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <button className="btn btn-primary my-3 rounded-pill">
        Add Reminder
      </button>
    </form>
  );
}
