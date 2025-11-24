import * as XLSX from 'xlsx';
import { Quiz, QuizQuestion, QuizOption, TimerMode } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const exportQuizToExcel = (quiz: Quiz) => {
  // Create Questions Sheet
  const rows = quiz.questions.map(q => {
    const row: any = {
      'Question': q.text,
      'Explanation': q.explanation || '',
      'Image URL': q.imageUrl || ''
    };

    q.options.forEach((opt, idx) => {
      row[`Option ${idx + 1}`] = opt.text;
      row[`Is Correct ${idx + 1}`] = opt.isCorrect;
    });

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");
  
  // Create Metadata Sheet
  const metaData = [
      { Key: 'Title', Value: quiz.title },
      { Key: 'Description', Value: quiz.description },
      { Key: 'Topic', Value: quiz.topic },
      { Key: 'Timer Mode', Value: quiz.timerMode || 'per-question' },
      { Key: 'Time Limit', Value: String(quiz.timeLimit || 30) }
  ];
  const metaSheet = XLSX.utils.json_to_sheet(metaData);
  XLSX.utils.book_append_sheet(workbook, metaSheet, "Metadata");

  // Export
  const fileName = `${quiz.title.replace(/[^a-z0-9]/gi, '_') || 'quiz'}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const importQuizFromExcel = async (file: File): Promise<Partial<Quiz>> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'array' });
                
                // Parse Metadata
                let title = "Imported Quiz";
                let description = "Imported from Excel";
                let topic = "General";
                let timerMode: TimerMode = 'per-question';
                let timeLimit = 30;

                if (workbook.SheetNames.includes("Metadata")) {
                    const metaSheet = workbook.Sheets["Metadata"];
                    const metaJson = XLSX.utils.sheet_to_json<{Key: string, Value: string}>(metaSheet);
                    metaJson.forEach(row => {
                        if (row.Key === 'Title' && row.Value) title = row.Value;
                        if (row.Key === 'Description' && row.Value) description = row.Value;
                        if (row.Key === 'Topic' && row.Value) topic = row.Value;
                        if (row.Key === 'Timer Mode' && row.Value) timerMode = row.Value as TimerMode;
                        if (row.Key === 'Time Limit' && row.Value) timeLimit = parseInt(row.Value, 10) || 30;
                    });
                }

                // Parse Questions
                const sheetName = workbook.SheetNames.includes("Questions") ? "Questions" : workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);

                const questions: QuizQuestion[] = json.map((row: any) => {
                    const options: QuizOption[] = [];
                    // Look for Option 1, Option 2 etc
                    for (let i = 1; i <= 6; i++) { // Support up to 6 options
                        if (row[`Option ${i}`] !== undefined) {
                            options.push({
                                id: uuidv4(),
                                text: String(row[`Option ${i}`]),
                                isCorrect: row[`Is Correct ${i}`] === true || String(row[`Is Correct ${i}`]).toLowerCase() === 'true'
                            });
                        }
                    }

                    // Ensure at least 2 options if none found (fallback)
                    if (options.length === 0) {
                        options.push({ id: uuidv4(), text: "True", isCorrect: true });
                        options.push({ id: uuidv4(), text: "False", isCorrect: false });
                    }

                    return {
                        id: uuidv4(),
                        text: row['Question'] || 'Untitled Question',
                        explanation: row['Explanation'],
                        imageUrl: row['Image URL'],
                        options
                    };
                });

                resolve({
                    title,
                    description,
                    topic,
                    questions,
                    timerMode,
                    timeLimit
                });

            } catch (error) {
                console.error("Excel import error:", error);
                reject(new Error("Failed to parse Excel file. Please ensure it has a valid structure."));
            }
        };
        
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsArrayBuffer(file);
    });
};