import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale'
import { X } from 'lucide-react';

interface NoteCardProps {
    note: {
        id: string
        date: Date
        content: string
    }
    onNoteDeleted: (id: string) => void
}

export function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
    return (
        <Dialog.Root>
            <Dialog.Trigger className="rounded-md text-left flex flex-col outline-none gap-3 dark:bg-slate-800 bg-slate-100 p-5 overflow-hidden relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
                <span className="text-sm font-medium dark:text-slate-300 text-slate-700">
                    {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
                </span>
                <p className="text-sm leading-6 dark:text-slate-400 text-slate-600">
                    {note.content}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t dark:from-black/60 dark:to-black/0 from-lime-400/60 to-lime-400/0 pointer-events-none" />
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 bg-black/50 fixed" />
                <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] dark:bg-slate-700 bg-slate-300 rounded-md flex flex-col outline-none">
                    <Dialog.Close className="absolute right-0 top-0 dark:bg-slate-800 p-1.5 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 text-slate-600 hover:text-slate-900">
                        <X className="size-5" />
                    </Dialog.Close>

                    <div className="flex flex-1 flex-col gap-3 p-5">
                        <span className="text-sm font-medium dark:text-slate-300 text-slate-700">
                            {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
                        </span>
                        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                            {note.content}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => onNoteDeleted(note.id)}
                        className="w-full dark:bg-slate-800 bg-slate-200 py-4 text-center text-sm dark:text-slate-300 text-slate-700 outline-none font-medium group"
                    >
                        Deseja <span className="text-red-400 group-hover:underline">apagar essa nota</span>?
                    </button>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}