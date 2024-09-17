import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  

const MapPicker = () => {
  return (
    <div>      
        <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Place content for the popover here.</PopoverContent>
        </Popover>
    </div>
  )
}

export default MapPicker