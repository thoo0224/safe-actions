"use client";

import { useEffect, useState } from "react";

import { useSafeAction } from "@thoo0224/safe-actions/client";

import { sendAlertAction } from "@/app/actions";

export default function AlertForm() {
  const { run, data, error, isRunning } = useSafeAction({
    action: sendAlertAction,
    persistData: true,
    revalidateCurrentPage: true,
  });

  const [alert, setAlert] = useState("Alert");
  const [name, setName] = useState("Ethan");

  useEffect(() => {
    if (data?.failure || !data?.message) return;

    window.alert(data?.message);
  }, [data]);

  return (
    <div className="p-5 flex flex-col gap-5">
      <input
        placeholder="Your Name"
        className="px-2 py-1 bg-gray-800 rounded ring-0"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Alert"
        className="px-2 py-1 bg-gray-800 rounded ring-0"
        value={alert}
        onChange={(e) => setAlert(e.target.value)}
      />
      <button
        className="bg-indigo-500 px-3 py-2 rounded-full hover:bg-indigo-600"
        onClick={() =>
          run({
            from: name,
            alert,
          })
        }
      >
        Send Alert
      </button>

      <div className="text-sm">
        <p>Data: {JSON.stringify(data)}</p>
        <p>Error: {JSON.stringify(error)}</p>
        <p>Is Running: {isRunning ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}
