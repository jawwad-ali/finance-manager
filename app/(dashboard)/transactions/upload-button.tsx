import { Upload } from "lucide-react"
import { useCSVReader } from "react-papaparse"

import { Button } from "@/components/ui/button"

type Props = {
    onUpload: (result: any) => void
}

const UploadButton = ({ onUpload }: Props) => {
    const { CSVReader } = useCSVReader() 
    return (
        <div className="w-full lg:w-auto">
            <CSVReader onUploadAccepted={onUpload}>
                {({ getRootProps }: any) => (
                    <Button className="w-full lg:w-auto" {...getRootProps()} size="sm" >
                        <Upload className="size-4 mr-2" />
                        Import CSV
                    </Button>
                )}
            </CSVReader>
        </div>
    )
}

export default UploadButton