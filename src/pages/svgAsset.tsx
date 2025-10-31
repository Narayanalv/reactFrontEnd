type ViewHideProps = {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    inputRef?: React.RefObject<HTMLInputElement>;
};

function ViewHide({ visible, setVisible, inputRef }: ViewHideProps) {
    const handleClick = () => {
        setVisible(!visible);
        inputRef?.current?.focus();
    };

    return (
        <div
            className="absolute inset-y-0 end-3 flex items-center cursor-pointer"
            onClick={handleClick}
        >
            <svg
                className="size-4 text-gray-500 dark:text-gray-400"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {visible ? (
                    <>
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                    </>
                ) : (
                    <>
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" y1="2" x2="22" y2="22" />
                    </>
                )}
            </svg>
        </div>
    );
}

export default ViewHide;
