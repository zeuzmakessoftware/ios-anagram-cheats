import React, { useState, useEffect, useRef } from 'react';

const IOSAnagramCheats = () => {
    const [inputs, setInputs] = useState<string[]>(Array(6).fill(''));
    const [validWords, setValidWords] = useState<string[]>([]);
    const [wordList, setWordList] = useState<string[]>([]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        loadWordList();
    }, []);

    const loadWordList = async () => {
        try {
            const response = await fetch('/words.txt');
            const text = await response.text();
            setWordList(text.split('\n').map(word => word.toLowerCase())); // Convert fetched word list to lowercase
        } catch (error) {
            console.error('Failed to load word list:', error);
        }
    };

    const handleInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newInputs = inputs.slice();
        newInputs[index] = event.target.value.slice(0, 1).toUpperCase();
        setInputs(newInputs);
        if (event.target.value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && index > 0 && !inputs[index] && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const generateWords = () => {
        const inputString = inputs.join('').toLowerCase(); // Convert input string to lowercase for processing
        if (inputString.length > 6) {
            alert("Please enter up to 6 letters.");
            return;
        }
        let permutations = getAllPermutations(inputString);
        validateWords(permutations);
    };

    const getAllPermutations = (str: string): string[] => {
        let permutations = new Set<string>();
        for (let i = 3; i <= Math.min(6, str.length); i++) {
            getPermutations(str, i, '', permutations);
        }
        return Array.from(permutations);
    };

    const getPermutations = (str: string, length: number, prefix: string, permutations: Set<string>) => {
        if (length === 0) {
            permutations.add(prefix);
            return;
        }
        for (let i = 0; i < str.length; i++) {
            getPermutations(str.slice(0, i) + str.slice(i + 1), length - 1, prefix + str[i], permutations);
        }
    };

    const validateWords = (permutations: string[]) => {
        const validWordsArray = permutations
            .filter(permutation => wordList.includes(permutation))
            .sort((a, b) => b.length - a.length);
        setValidWords(validWordsArray);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center">
                <h1 className="text-4xl mb-4 text-white">Enter Letters (up to 6)</h1>
                <div className="flex justify-center mb-4">
                    {inputs.map((value, index) => (
                        <input
                            key={index}
                            ref={el => inputRefs.current[index] = el}
                            type="text"
                            value={value}
                            onChange={handleInputChange(index)}
                            onKeyDown={handleKeyDown(index)}
                            className="m-2 w-16 h-16 text-black text-5xl font-extrabold text-center border-2 bg-orange-200 border-white rounded"
                        />
                    ))}
                </div>
                <button 
                    onClick={generateWords}
                    className="px-12 py-4 rounded-2xl bg-gray-100 border-4 hover:bg-gray-200 font-bold text-2xl m-4"
                >
                    Submit
                </button>
                {validWords.length > 0 && (
                    <div className="mt-4">
                        <p className="text-3xl text-white">Valid Words: <span className="font-black">{validWords.join(', ').toUpperCase()}</span></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IOSAnagramCheats;
