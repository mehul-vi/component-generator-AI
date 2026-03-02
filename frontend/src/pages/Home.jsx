import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Select from 'react-select'
import { BsStars } from 'react-icons/bs'
import { HiOutlineCode } from 'react-icons/hi'
import Editor from '@monaco-editor/react'
import { IoCloseSharp, IoCopy } from 'react-icons/io5'
import { PiExportBold } from 'react-icons/pi'
import { ImNewTab } from 'react-icons/im'
import { FiRefreshCcw } from 'react-icons/fi'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { SignedIn, useAuth } from "@clerk/clerk-react"
import { geminiAPI } from "../services/api"

const Home = () => {
  const { getToken } = useAuth();

  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
  ]

  const [outputScreen, setOutputScreen] = useState(false)
  const [tab, setTab] = useState(1)
  const [prompt, setPrompt] = useState("")
  const [frameWork] = useState(options[0])
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [history, setHistory] = useState([])
  const [cooldown, setCooldown] = useState(false)

  useEffect(() => {
    document.body.style.overflow = historyOpen ? "hidden" : "auto"
    return () => { document.body.style.overflow = "auto" }
  }, [historyOpen])

  // 🔥 GENERATE CODE USING BACKEND API
  const getResponse = async () => {
    if (loading || cooldown) return;
    if (!prompt.trim()) return toast.error("Please describe your component");

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
  }

  const fetchHistory = async () => {
    try {
      const result = await geminiAPI.getHistory();
      if (result.success) {
        setHistory(result.data);
      }
    } catch (error) {
      console.log("History fetch error:", error.message);
      // Don't show error to user for history fetch failures
    }
  }

  const copyCode = async () => {
    if (!code.trim()) return
    await navigator.clipboard.writeText(code)
    toast.success("Copied")
  }

  const downloadFile = () => {
    if (!code.trim()) return
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = "Code.html"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Navbar />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-16 mt-6">

        {/* LEFT PANEL */}
        <div className="w-full py-6 rounded-xl bg-[#141319] p-6">

          <div className="flex items-center justify-between">
            <h3 className='text-[25px] font-semibold text-white'>
              AI Component Generator
            </h3>

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

          <p className='text-gray-400 mt-2 text-[15px]'>
            Describe your component
          </p>

          <Select
            options={options}
            value={frameWork}
            isDisabled={loading}
            className='mt-3'
          />

          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className='w-full min-h-[180px] rounded-xl bg-[#09090B] mt-4 p-4 text-white outline-none'
          />

          <button
            onClick={getResponse}
            disabled={loading || cooldown}
            className={`flex items-center px-5 py-3 mt-4 rounded-lg gap-2 bg-gradient-to-r from-purple-500 to-purple-700 
            ${loading || cooldown ? "opacity-50" : "hover:scale-105 transition"}`}
          >
            {loading ? <ClipLoader color="white" size={18} /> : <BsStars />}
            Generate
          </button>

        </div>

        {/* RIGHT PANEL */}
        <div className="relative w-full h-[75vh] bg-[#141319] rounded-xl overflow-hidden">

          {!outputScreen ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <HiOutlineCode size={50} />
            </div>
          ) : (
            <>
              <div className="bg-[#17171C] h-[50px] flex items-center px-4 gap-3">
                <button onClick={() => setTab(1)}>Code</button>
                <button onClick={() => setTab(2)}>Preview</button>
              </div>

              <div className="bg-[#17171C] h-[50px] flex items-center justify-end px-4 gap-3">
                <button onClick={copyCode}><IoCopy /></button>
                <button onClick={downloadFile}><PiExportBold /></button>
              </div>

              <div className="h-full">
                {tab === 1 ? (
                  <Editor value={code} height="100%" theme='vs-dark' language="html" />
                ) : (
                  <iframe srcDoc={code} className="w-full h-full bg-white"></iframe>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* HISTORY SIDEBAR */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex">

          <div className="flex-1 bg-black/40"
            onClick={() => setHistoryOpen(false)} />

          <div className="w-[350px] bg-[#141319] h-full p-6 border-l border-gray-800 overflow-y-auto">

            <div className="flex justify-between items-center">
              <h2 className="text-white text-lg font-semibold">History</h2>
              <button onClick={() => setHistoryOpen(false)}>
                <IoCloseSharp size={20}/>
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
                  className="p-3 bg-[#1e1d24] rounded-lg cursor-pointer hover:bg-[#2a2933] transition text-gray-300"
                >
                  {item.prompt}
                </div>
              ))}

            </div>

          </div>
        </div>
      )}

    </>
  )
}

export default Home