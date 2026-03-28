import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Phase 3: AI Bridge (Node -> Python)
 * Executes the Python AI predictor with given metrics
 */
export async function getAIForecast(metrics) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../ai/impact_predictor.py');
    const pythonProcess = spawn('python', [scriptPath, JSON.stringify(metrics)]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`AI Bridge Error: ${error}`);
        return reject(new Error('AI script failed to execute'));
      }
      try {
        resolve(JSON.parse(result));
      } catch (e) {
        reject(new Error('Failed to parse AI output'));
      }
    });
  });
}
