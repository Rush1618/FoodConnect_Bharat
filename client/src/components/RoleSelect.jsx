import React from 'react';

export default function RoleSelect({ onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto p-4">
      {[
        { id: 'donor', title: 'I Have Food', color: 'bg-green-100', icon: '🍲' },
        { id: 'needer', title: 'I Need Food', color: 'bg-blue-100', icon: '🍽️' },
        { id: 'volunteer', title: 'I Can Deliver', color: 'bg-yellow-100', icon: '🚴' },
        { id: 'ngo', title: 'I Run an NGO', color: 'bg-purple-100', icon: '🏢' },
      ].map(role => (
        <button
          key={role.id}
          onClick={() => onSelect(role.id)}
          className={`p-6 rounded-2xl shadow-sm border hover:shadow-lg transition-transform hover:-translate-y-1 ${role.color} flex flex-col items-center justify-center gap-4`}
        >
          <span className="text-4xl">{role.icon}</span>
          <span className="font-bold text-lg text-gray-800">{role.title}</span>
        </button>
      ))}
    </div>
  );
}
