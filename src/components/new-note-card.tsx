import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner'

interface NewNoteCardProps {
    onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const [content, setContent] = useState('')

    function handleStartEditor() {
        setShouldShowOnboarding(false)
    }

    function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value)

        if (event.target.value === '') {
            setShouldShowOnboarding(true)
        }
    }

    function handleSaveNote(event: FormEvent) {
        event.preventDefault()

        if (content === '') {
            toast.error('Sem conteudo na nota!')
            return
        }

        onNoteCreated(content)

        setContent('')
        setShouldShowOnboarding(true)

        toast.success('Nota criada com sucesso!')
    }

    function handleStartRecording() {
        const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
            || 'webkitSpeechRecognition' in window

        if (!isSpeechRecognitionAPIAvailable) {
            alert('Este navegador não suporta a API de gravação!')

            return
        }

        setIsRecording(true)
        setShouldShowOnboarding(false)

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

        speechRecognition = new SpeechRecognitionAPI()

        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true
        speechRecognition.maxAlternatives = 1
        speechRecognition.interimResults = true

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, '')

            setContent(transcription)
        }

        speechRecognition.onerror = (event) => {
            console.error(event)
        }

        speechRecognition.start()
    }

    function handleStopRecording() {
        setIsRecording(false)

        if (speechRecognition !== null) {
            speechRecognition.stop()
        }
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger className="rounded-md text-left flex flex-col outline-none gap-3 dark:bg-slate-700 bg-slate-300 p-5 overflow-hidden relative hover:ring-2 dark:hover:ring-slate-600 hover:ring-slate-400 focus-visible:ring-2 focus-visible:ring-lime-400">
                <span className="text-sm font-medium dark:text-slate-200 text-slate-800">
                    Adicionar nota
                </span>
                <p className="text-sm leading-6 dark:text-slate-400 text-slate-600">
                    Grave uma nota em áudio que será convertida para texto automaticamente.
                </p>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 bg-black/50 fixed" />
                <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-300 dark:bg-slate-700 rounded-md flex flex-col outline-none">
                    <Dialog.Close className="absolute right-0 top-0 dark:bg-slate-800 bg-slate-200 p-1.5 dark:text-slate-400 text-slate-600 dark:hover:text-slate-100 hover:text-slate-900">
                        <X className="size-5" />
                    </Dialog.Close>

                    <form className="flex-1 flex flex-col">

                        <div className="flex flex-1 flex-col gap-3 p-5">
                            <span className="text-sm font-medium dark:text-slate-300 text-slate-700">
                                Adicionar nota
                            </span>

                            {shouldShowOnboarding ? (
                                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                                    Comece <button type="button" onClick={handleStartRecording} className="font-medium dark:text-lime-400 text-lime-600 hover:underline">gravando uma nota em áudio</button>{' '}
                                    ou se preferir <button type="button" onClick={handleStartEditor} className="font-medium text-lime-600 dark:text-lime-400 hover:underline">utilize apenas texto</button>.
                                </p>
                            ) : (
                                <textarea
                                    autoFocus
                                    className="text-sm leading-6 dark:text-slate-400 text-slate-600 bg-transparent resize-none flex-1 outline-none"
                                    onChange={handleContentChange}
                                    value={content}
                                />
                            )}
                        </div>

                        {isRecording ? (
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:text-slate-100 py-4 text-center text-sm text-slate-300 outline-none font-bold"
                                onClick={handleStopRecording}
                            >
                                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                                Gravando! (Clique p/ interromper)
                            </button>

                        ) : (
                            <button
                                type="button"
                                onClick={handleSaveNote}
                                className="w-full bg-lime-400 hover:bg-lime-500 py-4 text-center text-sm text-lime-950 outline-none font-bold"
                            >
                                Salvar nota
                            </button>
                        )}

                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}