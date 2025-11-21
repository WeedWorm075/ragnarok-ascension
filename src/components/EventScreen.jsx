import React from 'react';

const EventScreen = ({ eventChoice, chooseEventOption }) => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-gradient-to-br from-purple-900/40 to-black border-2 border-purple-500/50 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-purple-300 mb-4">{eventChoice.title}</h2>
        <p className="text-gray-300 text-lg mb-8">{eventChoice.desc}</p>
        <div className="space-y-4">
          {eventChoice.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => chooseEventOption(choice)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-lg font-semibold shadow-lg shadow-purple-500/50 transition-all text-left"
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventScreen;
