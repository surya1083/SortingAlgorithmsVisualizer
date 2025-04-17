import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';

const algorithms = [
  {
    name: 'Bubble Sort',
    visualize: async (array, setDisplayArray, setStep, speed, pausedRef, cancelRef) => {
      let arr = array.map(x => ({ value: x, state: 'default' }));
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          if (cancelRef.current) return;
          if (pausedRef.current) await new Promise(resolve => {
            const check = () => pausedRef.current && !cancelRef.current ? setTimeout(check, 100) : resolve();
            check();
          });
          if (cancelRef.current) return;
          setStep(`Comparing ${arr[j].value} and ${arr[j + 1].value}`);
          arr[j].state = 'comparing';
          arr[j + 1].state = 'comparing';
          setDisplayArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 1000 - speed));
          if (arr[j].value > arr[j + 1].value) {
            setStep(`Swapping ${arr[j].value} with ${arr[j + 1].value}`);
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setDisplayArray([...arr]);
            await new Promise(resolve => setTimeout(resolve, 1000 - speed));
          }
          arr[j].state = 'default';
          arr[j + 1].state = 'default';
        }
        arr[arr.length - i - 1].state = 'sorted';
        setDisplayArray([...arr]);
      }
      if (!cancelRef.current) setStep('Sorted!');
    },
  },
  {
    name: 'Selection Sort',
    visualize: async (array, setDisplayArray, setStep, speed, pausedRef, cancelRef) => {
      let arr = array.map(x => ({ value: x, state: 'default' }));
      for (let i = 0; i < arr.length; i++) {
        let minIdx = i;
        arr[i].state = 'comparing';
        for (let j = i + 1; j < arr.length; j++) {
          if (cancelRef.current) return;
          if (pausedRef.current) await new Promise(resolve => {
            const check = () => pausedRef.current && !cancelRef.current ? setTimeout(check, 100) : resolve();
            check();
          });
          if (cancelRef.current) return;
          setStep(`Finding min from index ${i}, checking ${arr[j].value}`);
          arr[j].state = 'comparing';
          setDisplayArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 1000 - speed));
          if (arr[j].value < arr[minIdx].value) {
            if (minIdx !== i) arr[minIdx].state = 'default';
            minIdx = j;
            arr[minIdx].state = 'pivot';
          }
          if (j !== minIdx) arr[j].state = 'default';
          setDisplayArray([...arr]);
        }
        if (minIdx !== i) {
          setStep(`Swapping ${arr[i].value} with ${arr[minIdx].value}`);
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          setDisplayArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 1000 - speed));
        }
        arr[i].state = 'sorted';
        arr[minIdx].state = 'default';
        setDisplayArray([...arr]);
      }
      if (!cancelRef.current) setStep('Sorted!');
    },
  },
  {
    name: 'Insertion Sort',
    visualize: async (array, setDisplayArray, setStep, speed, pausedRef, cancelRef) => {
      let arr = array.map(x => ({ value: x, state: 'default' }));
      for (let i = 1; i < arr.length; i++) {
        let key = arr[i].value;
        let j = i - 1;
        arr[i].state = 'pivot';
        setStep(`Inserting ${key}`);
        setDisplayArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, 1000 - speed));
        while (j >= 0 && arr[j].value > key) {
          if (cancelRef.current) return;
          if (pausedRef.current) await new Promise(resolve => {
            const check = () => pausedRef.current && !cancelRef.current ? setTimeout(check, 100) : resolve();
            check();
          });
          if (cancelRef.current) return;
          setStep(`Shifting ${arr[j].value} right`);
          arr[j].state = 'comparing';
          arr[j + 1] = arr[j];
          setDisplayArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 1000 - speed));
          arr[j].state = 'default';
          j--;
        }
        arr[j + 1] = { value: key, state: 'sorted' };
        setDisplayArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, 1000 - speed));
      }
      arr.forEach(x => (x.state = 'sorted'));
      setDisplayArray([...arr]);
      if (!cancelRef.current) setStep('Sorted!');
    },
  },
  {
    name: 'Merge Sort',
    visualize: async (array, setDisplayArray, setStep, speed, pausedRef, cancelRef) => {
      let arr = array.map(x => ({ value: x, state: 'default' }));
      const merge = async (l, m, r) => {
        let left = arr.slice(l, m + 1);
        let right = arr.slice(m + 1, r + 1);
        setStep(`Merging ${left.map(x => x.value).join(',')} and ${right.map(x => x.value).join(',')}`);
        for (let i = l; i <= r; i++) arr[i].state = 'comparing';
        setDisplayArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, 1000 - speed));
        let i = 0, j = 0, k = l;
        while (i < left.length && j < right.length) {
          if (cancelRef.current) return;
          if (pausedRef.current) await new Promise(resolve => {
            const check = () => pausedRef.current && !cancelRef.current ? setTimeout(check, 100) : resolve();
            check();
          });
          if (cancelRef.current) return;
          if (left[i].value <= right[j].value) {
            arr[k] = { ...left[i], state: 'sorted' };
            i++;
          } else {
            arr[k] = { ...right[j], state: 'sorted' };
            j++;
          }
          setDisplayArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 1000 - speed));
          k++;
        }
        while (i < left.length) {
          arr[k] = { ...left[i], state: 'sorted' };
          i++;
          k++;
          setDisplayArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 1000 - speed));
        }
        while (j < right.length) {
          arr[k] = { ...right[j], state: 'sorted' };
          j++;
          k++;
          setDisplayArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 1000 - speed));
        }
      };
      const mergeSort = async (l, r) => {
        if (l < r) {
          let m = Math.floor((l + r) / 2);
          setStep(`Dividing array from ${l} to ${r}`);
          for (let i = l; i <= r; i++) arr[i].state = 'pivot';
          setDisplayArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 1000 - speed));
          await mergeSort(l, m);
          await mergeSort(m + 1, r);
          await merge(l, m, r);
        }
      };
      await mergeSort(0, arr.length - 1);
      if (!cancelRef.current) setStep('Sorted!');
    },
  },
  {
    name: 'Quick Sort',
    visualize: async (array, setDisplayArray, setStep, speed, pausedRef, cancelRef) => {
      let arr = array.map(x => ({ value: x, state: 'default' }));
      const partition = async (low, high) => {
        let pivot = arr[high].value;
        arr[high].state = 'pivot';
        setStep(`Choosing pivot: ${pivot}`);
        setDisplayArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, 1000 - speed));
        let i = low - 1;
        for (let j = low; j < high; j++) {
          if (cancelRef.current) return;
          if (pausedRef.current) await new Promise(resolve => {
            const check = () => pausedRef.current && !cancelRef.current ? setTimeout(check, 100) : resolve();
            check();
          });
          if (cancelRef.current) return;
          arr[j].state = 'comparing';
          setStep(`Comparing ${arr[j].value} with pivot ${pivot}`);
          setDisplayArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 1000 - speed));
          if (arr[j].value < pivot) {
            i++;
            if (i !== j) {
              setStep(`Swapping ${arr[i].value} with ${arr[j].value}`);
              [arr[i], arr[j]] = [arr[j], arr[i]];
              setDisplayArray([...arr]);
              await new Promise(resolve => setTimeout(resolve, 1000 - speed));
            }
          }
          arr[j].state = 'default';
        }
        setStep(`Placing pivot ${pivot} at index ${i + 1}`);
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        arr[i + 1].state = 'sorted';
        arr[high].state = 'default';
        setDisplayArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, 1000 - speed));
        return i + 1;
      };
      const quickSort = async (low, high) => {
        if (low < high) {
          let pi = await partition(low, high);
          await quickSort(low, pi - 1);
          await quickSort(pi + 1, high);
        }
      };
      await quickSort(0, arr.length - 1);
      arr.forEach(x => (x.state = 'sorted'));
      setDisplayArray([...arr]);
      if (!cancelRef.current) setStep('Sorted!');
    },
  },
  {
    name: 'Heap Sort',
    visualize: async (array, setDisplayArray, setStep, speed, pausedRef, cancelRef) => {
      let arr = array.map(x => ({ value: x, state: 'default' }));
      const heapify = async (n, i) => {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        arr[i].state = 'comparing';
        if (left < n) arr[left].state = 'comparing';
        if (right < n) arr[right].state = 'comparing';
        setStep(`Heapifying at index ${i}`);
        setDisplayArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, 1000 - speed));
        if (left < n && arr[left].value > arr[largest].value) largest = left;
        if (right < n && arr[right].value > arr[largest].value) largest = right;
        if (largest !== i) {
          if (cancelRef.current) return;
          if (pausedRef.current) await new Promise(resolve => {
            const check = () => pausedRef.current && !cancelRef.current ? setTimeout(check, 100) : resolve();
            check();
          });
          if (cancelRef.current) return;
          setStep(`Swapping ${arr[i].value} with ${arr[largest].value}`);
          [arr[i], arr[largest]] = [arr[largest], arr[i]];
          setDisplayArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 1000 - speed));
          arr[i].state = 'default';
          if (left < n) arr[left].state = 'default';
          if (right < n) arr[right].state = 'default';
          await heapify(n, largest);
        } else {
          arr[i].state = 'default';
          if (left < n) arr[left].state = 'default';
          if (right < n) arr[right].state = 'default';
          setDisplayArray([...arr]);
        }
      };
      for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
        await heapify(arr.length, i);
      }
      for (let i = arr.length - 1; i > 0; i--) {
        setStep(`Moving max ${arr[0].value} to end`);
        [arr[0], arr[i]] = [arr[i], arr[0]];
        arr[i].state = 'sorted';
        setDisplayArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, 1000 - speed));
        await heapify(i, 0);
      }
      arr[0].state = 'sorted';
      setDisplayArray([...arr]);
      if (!cancelRef.current) setStep('Sorted!');
    },
  },
  {
    name: 'Counting Sort',
    visualize: async (array, setDisplayArray, setStep, speed, pausedRef, cancelRef) => {
      let arr = array.map(x => ({ value: x, state: 'default' }));
      let min = Math.min(...arr.map(x => x.value));
      let max = Math.max(...arr.map(x => x.value));
      let offset = min < 0 ? -min : 0;
      let count = Array(max + offset + 1).fill(0);
      for (let i = 0; i < arr.length; i++) {
        if (cancelRef.current) return;
        if (pausedRef.current) await new Promise(resolve => {
          const check = () => pausedRef.current && !cancelRef.current ? setTimeout(check, 100) : resolve();
            check();
          });
          if (cancelRef.current) return;
          arr[i].state = 'comparing';
          setStep(`Counting ${arr[i].value}`);
          setDisplayArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 1000 - speed));
          count[arr[i].value + offset]++;
          arr[i].state = 'default';
        }
        let output = [];
        for (let i = 0; i < count.length; i++) {
          while (count[i] > 0) {
            if (cancelRef.current) return;
            if (pausedRef.current) await new Promise(resolve => {
              const check = () => pausedRef.current && !cancelRef.current ? setTimeout(check, 100) : resolve();
              check();
            });
            if (cancelRef.current) return;
            setStep(`Placing ${i - offset} in output`);
            output.push({ value: i - offset, state: 'sorted' });
            setDisplayArray([...output, ...arr.slice(output.length)]);
            await new Promise(resolve => setTimeout(resolve, 1000 - speed));
            count[i]--;
          }
        }
        setDisplayArray(output);
        if (!cancelRef.current) setStep('Sorted!');
      },
    },
    {
      name: 'Radix Sort',
      visualize: async (array, setDisplayArray, setStep, speed, pausedRef, cancelRef) => {
        let arr = array.map(x => ({ value: x, state: 'default' }));
        let max = Math.max(...arr.map(x => Math.abs(x.value)));
        const countingSort = async exp => {
          let output = Array(arr.length).fill({ value: 0, state: 'default' });
          let count = Array(10).fill(0);
          for (let i = 0; i < arr.length; i++) {
            if (cancelRef.current) return;
            if (pausedRef.current) await new Promise(resolve => {
              const check = () => pausedRef.current && !cancelRef.current ? setTimeout(check, 100) : resolve();
              check();
            });
            if (cancelRef.current) return;
            let digit = Math.floor(Math.abs(arr[i].value) / exp) % 10;
            arr[i].state = 'comparing';
            setStep(`Counting digit ${digit} of ${arr[i].value}`);
            setDisplayArray([...arr]);
            await new Promise(resolve => setTimeout(resolve, 1000 - speed));
            count[digit]++;
            arr[i].state = 'default';
          }
          for (let i = 1; i < 10; i++) count[i] += count[i - 1];
          for (let i = arr.length - 1; i >= 0; i--) {
            let digit = Math.floor(Math.abs(arr[i].value) / exp) % 10;
            arr[i].state = 'comparing';
            setStep(`Placing ${arr[i].value} for digit ${digit}`);
            output[count[digit] - 1] = { ...arr[i], state: 'sorted' };
            count[digit]--;
            setDisplayArray([...output, ...arr.filter((_, idx) => !output[idx])]);
            await new Promise(resolve => setTimeout(resolve, 1000 - speed));
            arr[i].state = 'default';
          }
          arr = output;
          setDisplayArray([...arr]);
        };
        for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
          setStep(`Processing digit place ${exp}`);
          await countingSort(exp);
        }
        let neg = arr.filter(x => x.value < 0).reverse();
        let pos = arr.filter(x => x.value >= 0);
        arr = [...neg, ...pos].map(x => ({ ...x, state: 'sorted' }));
        setDisplayArray([...arr]);
        if (!cancelRef.current) setStep('Sorted!');
      },
    },
    {
      name: 'Bucket Sort',
      visualize: async (array, setDisplayArray, setStep, speed, pausedRef, cancelRef) => {
        let arr = array.map(x => ({ value: x, state: 'default' }));
        let min = Math.min(...arr.map(x => x.value));
        let max = Math.max(...arr.map(x => x.value));
        let bucketCount = Math.min(5, arr.length);
        let buckets = Array.from({ length: bucketCount }, () => []);
        for (let i = 0; i < arr.length; i++) {
          if (cancelRef.current) return;
          if (pausedRef.current) await new Promise(resolve => {
            const check = () => pausedRef.current && !cancelRef.current ? setTimeout(check, 100) : resolve();
            check();
          });
          if (cancelRef.current) return;
          arr[i].state = 'comparing';
          setStep(`Placing ${arr[i].value} in bucket`);
          let bucketIdx = Math.floor(((arr[i].value - min) * bucketCount) / (max - min + 1));
          buckets[bucketIdx].push(arr[i]);
          setDisplayArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 1000 - speed));
          arr[i].state = 'default';
        }
        let output = [];
        for (let i = 0; i < bucketCount; i++) {
          setStep(`Sorting bucket ${i}`);
          buckets[i].sort((a, b) => a.value - b.value);
          for (let j = 0; j < buckets[i].length; j++) {
            buckets[i][j].state = 'sorted';
            setStep(`Placing ${buckets[i][j].value} in output`);
            output.push(buckets[i][j]);
            setDisplayArray([...output, ...arr.filter(x => !output.includes(x))]);
            await new Promise(resolve => setTimeout(resolve, 1000 - speed));
          }
        }
        setDisplayArray(output);
        if (!cancelRef.current) setStep('Sorted!');
      },
    },
  ];
  
  // Error Boundary Component
  class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };
  
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
  
    render() {
      if (this.state.hasError) {
        console.error('Error in Steps component:', this.state.error);
        return <p>Error rendering steps. Please check console.</p>;
      }
      return this.props.children;
    }
  }
  
  export default function App() {
    const [array, setArray] = useState([]);
    const [displayArray, setDisplayArray] = useState([]);
    const [input, setInput] = useState('');
    const [selectedAlgo, setSelectedAlgo] = useState(algorithms[0]);
    const [step, setStep] = useState('Enter an array to start!');
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const pausedRef = useRef(false);
    const cancelRef = useRef(false);
  
    useEffect(() => {
      pausedRef.current = isPaused;
    }, [isPaused]);
  
    const logSetStep = (newStep) => {
      console.log('Setting step:', newStep);
      setStep(newStep);
    };
  
    const handleInput = (value) => {
      setInput(value);
      if (!value.trim()) {
        setArray([]);
        setDisplayArray([]);
        logSetStep('Enter an array to start!');
        return;
      }
  
      const parts = value.split(',').map(x => x.trim()).filter(x => x);
      const nums = [];
      const invalidParts = [];
  
      parts.forEach(part => {
        if (/^-?\d+$/.test(part)) {
          nums.push(parseInt(part, 10));
        } else {
          invalidParts.push(part);
        }
      });
  
      if (nums.length > 0 && nums.length <= 15 && invalidParts.length === 0) {
        setArray(nums);
        setDisplayArray(nums.map(x => ({ value: x, state: 'default' })));
        logSetStep(`Input array set: [${nums.join(',')}]`);
      } else {
        setArray([]);
        setDisplayArray([]);
        logSetStep(`Invalid input! Use 1-15 comma-separated integers (e.g., -1,1000,23). ${invalidParts.length > 0 ? `Invalid: ${invalidParts.join(', ')}` : 'Check for extra commas or spaces.'}`);
      }
    };
  
    const runAlgorithm = async () => {
      if (array.length === 0) {
        logSetStep('Enter a valid array first!');
        return;
      }
      setIsRunning(true);
      setIsPaused(false);
      pausedRef.current = false;
      cancelRef.current = false;
      logSetStep('');
      setDisplayArray(array.map(x => ({ value: x, state: 'default' })));
      await selectedAlgo.visualize([...array], setDisplayArray, logSetStep, speed, pausedRef, cancelRef);
      setIsRunning(false);
      setIsPaused(false);
      pausedRef.current = false;
      cancelRef.current = false;
    };
  
    const togglePause = () => {
      if (!isRunning) return;
      setIsPaused(prev => !prev);
      logSetStep(!isPaused ? `Paused: ${selectedAlgo.name}` : `Resumed: ${selectedAlgo.name}`);
    };
  
    const resetArray = () => {
      setArray([]);
      setDisplayArray([]);
      setInput('');
      logSetStep('Enter an array to start!');
      setIsRunning(false);
      setIsPaused(false);
      pausedRef.current = false;
      cancelRef.current = true;
    };
  
    const [speed, setSpeed] = useState(500);
    const maxAbsValue = Math.max(1, ...array.map(x => Math.abs(x)));
    const scaleFactor = 500 / maxAbsValue;
  
    return (
      <div className="app">
        <header>
          <h1>SortingAlgorithmsVisualizer</h1>
          <div className="header-controls">
            <select
              onChange={e => setSelectedAlgo(algorithms.find(a => a.name === e.target.value))}
              disabled={isRunning}
            >
              {algorithms.map(algo => (
                <option key={algo.name} value={algo.name}>
                  {algo.name}
                </option>
              ))}
            </select>
            <div className="speed-control">
              <span>Change Speed</span>
              <input
                type="range"
                min="100"
                max="900"
                value={speed}
                onChange={e => setSpeed(Number(e.target.value))}
                disabled={isRunning}
                title="Speed Slider"
              />
            </div>
          </div>
        </header>
        <main>
          <div className="input">
            <span>Add Input Here</span>
            <input
              type="text"
              value={input}
              onChange={e => handleInput(e.target.value)}
              placeholder="Enter the input array here"
              disabled={isRunning}
            />
          </div>
          <div className="visualizer">
            <AnimatePresence>
              {displayArray.map((item, index) => (
                <motion.div
                  key={index}
                  className={`bar ${item.state} ${item.value < 0 ? 'negative' : ''}`}
                  style={{
                    height: `${Math.abs(item.value) * scaleFactor}px`,
                    marginTop: item.value < 0 ? `${-Math.abs(item.value) * scaleFactor * 0.3}px` : '0',
                  }}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
                >
                  {item.value}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="controls">
            <button onClick={runAlgorithm} disabled={array.length === 0}>
              {isRunning ? 'Running...' : 'Run'}
            </button>
            <button onClick={togglePause} disabled={!isRunning}>
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={resetArray} disabled={isRunning}>
              Reset
            </button>
          </div>
          <ErrorBoundary>
            <div className="steps">
              <h2>Steps</h2>
              <p>{step || 'Enter an array and click Run!'}</p>
            </div>
          </ErrorBoundary>
        </main>
      </div>
    );
  }