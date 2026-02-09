import React, { useState } from "react";
import Header from "../../components/ui/Header";
import PerformanceMonitor from "../../components/ui/PerformanceMonitor";
import Icon from "../../components/AppIcon";
import { BigNote, Note } from "@raydedon/assessment-lib";

import {
  getCurrentDate,
  getTomorrowDate,
  getFutureDate,
  isLeapYear,
  getCurrentYear,
  parsePhone,
  chunkArray,
  getUnique,
  sortByProperty,
  groupByProperty,
} from "@raydedon/assessment-lib";

const Library = () => {
  const [phoneInput, setPhoneInput] = useState("+1 (555) 123-4567");
  const [phoneValidation, setPhoneValidation] = useState(null);

  // Date examples
  const currentDate = getCurrentDate();
  const tomorrowDate = getTomorrowDate();
  const futureDate = getFutureDate(30);
  const leapYear = isLeapYear();
  const currentYear = getCurrentYear();

  // Lodash array transformation examples
  const sampleArray = [1, 2, 3, 4, 5, 6, 7, 8];
  const chunkedArray = chunkArray(sampleArray, 3);

  const duplicateArray = [1, 2, 2, 3, 3, 4, 5, 5];
  const uniqueArray = getUnique(duplicateArray);

  const users = [
    { name: "Alice", age: 30, role: "admin" },
    { name: "Bob", age: 25, role: "user" },
    { name: "Charlie", age: 35, role: "admin" },
    { name: "David", age: 28, role: "user" },
  ];
  const sortedUsers = sortByProperty(users, "age", "desc");
  const groupedByRole = groupByProperty(users, "role");

  const handlePhoneValidation = () => {
    const result = parsePhone(phoneInput, "US");
    setPhoneValidation(result);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PerformanceMonitor />
      <main className="pt-[76px] pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <Icon name="AlertTriangle" className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Library
                </h1>
                <p className="text-muted-foreground mt-1">examples</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Date/Time Examples with Moment.js */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Calendar" className="w-5 h-5" />
                Date & Time (Moment.js)
              </h2>
              <div className="space-y-2 text-sm">
                <p className="text-foreground">
                  <span className="font-medium">Current Date:</span> {currentDate}
                </p>
                <p className="text-foreground">
                  <span className="font-medium">Tomorrow:</span> {tomorrowDate}
                </p>
                <p className="text-foreground">
                  <span className="font-medium">30 Days from Now:</span> {futureDate}
                </p>
                <p className="text-foreground">
                  <span className="font-medium">Is {currentYear} a Leap Year?</span>{" "}
                  {leapYear ? "Yes ✓" : "No ✗"}
                </p>
              </div>
            </div>

            {/* Phone Number Validation */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Phone" className="w-5 h-5" />
                Phone Number Validation (libphonenumber-js)
              </h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                    placeholder="Enter phone number"
                  />
                  <button
                    onClick={handlePhoneValidation}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                  >
                    Validate
                  </button>
                </div>
                {phoneValidation && (
                  <div className="bg-muted p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">
                      Valid: {phoneValidation.isValid ? "✓ Yes" : "✗ No"}
                    </p>
                    {phoneValidation.isValid && (
                      <>
                        <p>International: {phoneValidation.international}</p>
                        <p>National: {phoneValidation.national}</p>
                        <p>Country: {phoneValidation.country}</p>
                        <p>Type: {phoneValidation.type}</p>
                      </>
                    )}
                    {phoneValidation.error && (
                      <p className="text-red-500">{phoneValidation.error}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Lodash Array Transformations */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="ListFilter" className="w-5 h-5" />
                Array Transformations (Lodash)
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-foreground mb-1">Original Array:</p>
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    {JSON.stringify(sampleArray)}
                  </code>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Chunked (size 3):</p>
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    {JSON.stringify(chunkedArray)}
                  </code>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Unique Values:</p>
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    From: {JSON.stringify(duplicateArray)} → To: {JSON.stringify(uniqueArray)}
                  </code>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Sorted by Age (desc):</p>
                  <div className="bg-muted px-2 py-2 rounded text-xs space-y-1">
                    {sortedUsers.map((user, i) => (
                      <div key={i}>
                        {user.name} - {user.age} years - {user.role}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Grouped by Role:</p>
                  <div className="bg-muted px-2 py-2 rounded text-xs">
                    {Object.entries(groupedByRole).map(([role, users]) => (
                      <div key={role} className="mb-2">
                        <strong>{role}:</strong> {users.map(u => u.name).join(", ")}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
                        <Note
              title="Reminder"
              content="Don't forget to review the project proposal today!"
            />
            <BigNote
              title="Description"
              content="Don't forget to review the project proposal today!"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Library;
