import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { HiOutlineCode } from 'react-icons/hi';
import Editor from '@monaco-editor/react';
import { IoCloseSharp, IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { SignedIn, useAuth } from "@clerk/clerk-react"
import { geminiAPI } from "../services/api"
import { useTheme } from '../context/ThemeContext'

const Home = () => {
  const { getToken } = useAuth();
  const { theme } = useTheme();

  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false)
  const [history, setHistory] = useState([])
  const [cooldown, setCooldown] = useState(false)

  useEffect(() => {
    document.body.style.overflow = historyOpen || isNewTabOpen ? "hidden" : "auto"
    return () => { document.body.style.overflow = "auto" }
  }, [historyOpen, isNewTabOpen])

  const getResponse = async () => {
    if (loading || cooldown) return;
    if (!prompt.trim()) return toast.error("Please describe your component first");

    try {
      setLoading(true);
      setCooldown(false);

      // Call backend API
      const result = await geminiAPI.generateCode(prompt, frameWork.value, getToken);

      if (result.success) {
        setCode(result.data.code);
        setOutputScreen(true);
        toast.success("Code generated successfully!");
      } else {
        toast.error(result.message || "Failed to generate code");
      }

    } catch (error) {
      console.error("Generation error:", error);

      if (error.response?.status === 429) {
        toast.error("Too many requests. Please wait a moment.");
        setCooldown(true);
        setTimeout(() => setCooldown(false), 60000); // 1 minute cooldown
      } else {
        toast.error("Generation failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const result = await geminiAPI.getHistory(getToken);
      if (result.success) {
        setHistory(result.data);
      }
    } catch (error) {
      console.log("History fetch error:", error.message);
    }
  }

  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy");
    }
  };

  const downloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");

    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-black transition-colors duration-300">
      <Navbar />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-16 pb-10">
        {/* Left Section */}
        <div className="w-full py-6 rounded-xl bg-white dark:bg-[#141319] shadow-[0_0px_20px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-200 dark:border-transparent mt-5 p-5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <h3 className='text-[25px] font-semibold text-gray-800 dark:text-white'>AI Component Generator</h3>
            <SignedIn>
              <button
                onClick={() => {
                  setHistoryOpen(true)
                  fetchHistory()
                }}
                className="px-4 py-2 text-sm rounded-lg bg-purple-600 hover:bg-purple-700 transition text-white"
              >
                History
              </button>
            </SignedIn>
          </div>

          <p className='text-gray-600 dark:text-gray-400 mt-2 text-[16px]'>Describe your component and let AI code it for you.</p>

          <p className='text-[15px] font-[700] mt-4 text-gray-800 dark:text-white'>Framework</p>
          <Select
            className='mt-2'
            options={options}
            value={frameWork}
            isDisabled={loading}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: theme === 'dark' ? "#111" : "#F9FAFB",
                borderColor: theme === 'dark' ? "#333" : "#D1D5DB",
                color: theme === 'dark' ? "#fff" : "#111827",
                boxShadow: "none",
                "&:hover": { borderColor: theme === 'dark' ? "#555" : "#9CA3AF" }
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: theme === 'dark' ? "#111" : "#fff",
                color: theme === 'dark' ? "#fff" : "#111827"
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? theme === 'dark' ? "#333" : "#E5E7EB"
                  : state.isFocused
                    ? theme === 'dark' ? "#222" : "#F3F4F6"
                    : theme === 'dark' ? "#111" : "#fff",
                color: theme === 'dark' ? "#fff" : "#111827",
                "&:active": { backgroundColor: theme === 'dark' ? "#444" : "#D1D5DB" }
              }),
              singleValue: (base) => ({ ...base, color: theme === 'dark' ? "#fff" : "#111827" }),
              placeholder: (base) => ({ ...base, color: theme === 'dark' ? "#aaa" : "#9CA3AF" }),
              input: (base) => ({ ...base, color: theme === 'dark' ? "#fff" : "#111827" })
            }}
            onChange={(selected) => setFrameWork(selected)}
          />

          <p className='text-[15px] font-[700] mt-5 text-gray-800 dark:text-white'>Describe your component</p>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            disabled={loading}
            className='w-full min-h-[200px] rounded-xl bg-[#F9FAFB] dark:bg-[#09090B] border border-gray-300 dark:border-transparent mt-3 p-4 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-colors duration-300 shadow-sm'
            placeholder="Describe your component in detail and AI will generate it..."
          ></textarea>

          <div className="flex items-center justify-between mt-3">
            <p className='text-gray-500 dark:text-gray-400 text-sm'>Click on generate button to get your code</p>
            <button
              onClick={getResponse}
              disabled={loading || cooldown}
              className={`flex items-center p-3 rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 px-5 gap-2 transition-all hover:opacity-80
              ${loading || cooldown ? "opacity-50" : "hover:scale-105 active:scale-95 text-white"}`}
            >
              {loading ? <ClipLoader color='white' size={18} /> : <BsStars color="white" />}
              <span className="text-white">Generate</span>
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative mt-5 w-full h-[80vh] bg-white dark:bg-[#141319] shadow-[0_0px_20px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-200 dark:border-transparent rounded-xl overflow-hidden transition-all duration-300">
          {
            !outputScreen ? (
              <div className="w-full h-full flex items-center flex-col justify-center">
                <div className="p-5 w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600 shadow-md">
                  <HiOutlineCode color="white" />
                </div>
                <p className='text-[16px] text-gray-500 dark:text-gray-400 mt-3'>Your component & code will appear here.</p>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="bg-[#F3F4F6] dark:bg-[#17171C] border-b border-gray-200 dark:border-transparent w-full h-[50px] flex items-center gap-3 px-3 transition-colors duration-300">
                  <button
                    onClick={() => setTab(1)}
                    className={`w-1/2 py-2 rounded-lg transition-all font-medium ${tab === 1 ? "bg-white text-purple-700 shadow-sm border border-gray-300" : "bg-transparent dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"}`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setTab(2)}
                    className={`w-1/2 py-2 rounded-lg transition-all font-medium ${tab === 2 ? "bg-white text-purple-700 shadow-sm border border-gray-300" : "bg-transparent dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"}`}
                  >
                    Preview
                  </button>
                </div>

                {/* Toolbar */}
                <div className="bg-white dark:bg-[#17171C] w-full h-[50px] flex items-center justify-between px-4 transition-colors duration-300 border-b border-gray-200 dark:border-transparent">
                  <p className='font-bold text-gray-800 dark:text-gray-200'>Code Editor</p>
                  <div className="flex items-center gap-2">
                    {tab === 1 ? (
                      <>
                        <button onClick={copyCode} className="text-gray-700 dark:text-white w-10 h-10 rounded-xl border border-gray-300 hover:border-gray-400 dark:border-zinc-800 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"><IoCopy /></button>
                        <button onClick={downloadFile} className="text-gray-700 dark:text-white w-10 h-10 rounded-xl border border-gray-300 hover:border-gray-400 dark:border-zinc-800 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"><PiExportBold /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setIsNewTabOpen(true)} className="text-gray-700 dark:text-white w-10 h-10 rounded-xl border border-gray-300 hover:border-gray-400 dark:border-zinc-800 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"><ImNewTab /></button>
                        <button onClick={() => setRefreshKey(prev => prev + 1)} className="text-gray-700 dark:text-white w-10 h-10 rounded-xl border border-gray-300 hover:border-gray-400 dark:border-zinc-800 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"><FiRefreshCcw /></button>
                      </>
                    )}
                  </div>
                </div>

                {/* Editor / Preview */}
                <div className="h-[calc(100%-100px)]">
                  {tab === 1 ? (
                    <div className="h-full bg-[#1e1e1e]">
                      <Editor value={code} height="100%" theme='vs-dark' language="html" />
                    </div>
                  ) : (
                    <iframe key={refreshKey} srcDoc={code} className="w-full h-full bg-white text-black"></iframe>
                  )}
                </div>
              </>
            )
          }
        </div>
      </div>

      {/* ✅ Fullscreen Preview Overlay */}
      {isNewTabOpen && (
        <div className="fixed inset-0 z-50 bg-white w-screen h-screen overflow-auto">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-white dark:bg-[#141319] dark:text-white border-b border-gray-200 dark:border-gray-800">
            <p className='font-bold text-gray-800 dark:text-white'>Preview</p>
            <button onClick={() => setIsNewTabOpen(false)} className="w-10 h-10 rounded-xl border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-white">
              <IoCloseSharp />
            </button>
          </div>
          <iframe srcDoc={code} className="w-full h-[calc(100vh-60px)] bg-white"></iframe>
        </div>
      )}

      {/* HISTORY SIDEBAR */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setHistoryOpen(false)} />
          <div className="w-[350px] bg-white dark:bg-[#141319] h-full p-6 border-l border-gray-200 dark:border-gray-800 overflow-y-auto transition-colors duration-300 shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-gray-800 dark:text-white text-lg font-semibold">History</h2>
              <button onClick={() => setHistoryOpen(false)} className="text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 transition-colors">
                <IoCloseSharp size={20} />
              </button>
            </div>
            <div className="mt-6 space-y-3">
              {history.length === 0 && (
                <p className="text-gray-500 text-sm">No history yet</p>
              )}
              {history.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setCode(item.code)
                    setOutputScreen(true)
                    setHistoryOpen(false)
                  }}
                  className="p-3 bg-white dark:bg-[#1e1d24] border border-gray-200 dark:border-transparent rounded-lg cursor-pointer hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-[#2a2933] transition-all text-gray-700 dark:text-gray-300 shadow-sm"
                >
                  {item.prompt}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home