// V 1.0
interface Task {
   content: string;
   element: JQuery;
   timestamp: number;
}
class Task implements Task {
   public content: string;
   
   constructor(content: string, public timestamp: number = Date.now()) {

      let task: JQuery = $("<div>", {
            "class": "task text-col"
         }),
         taskTimestamp: JQuery = $("<div>", {
            html: `${Task.getDay(new Date(this.timestamp).getDay())} ${new Date(this.timestamp).getDate()} 
               ${Task.getMonth(new Date(this.timestamp).getMonth())} ${new Date(this.timestamp).getFullYear()}
               ${new Date(this.timestamp).getHours()}:${new Date(this.timestamp).getMinutes()}`,
            "class": "timestamp"
         }),
         taskContent: JQuery = $("<p>", {
            html: content.trim(),
            "class": "content text-col"
         }),
         deleteBtn: JQuery = $("<button>", {
            html: "Delete",
            "class": "delete"
         }),
         editBtn: JQuery = $("<button>", {
            html: "Edit",
            "class": "edit"
         }),
         copyBtn: JQuery = $("<button>", {
            html: "Copy text",
            "class": "copy"
         });

      // Task delete logic
      deleteBtn.click(function(event): void {
         showModalWindow();

         let index = 0;
            for (let em of main_content.children(".task")) {
               if ($(em).text() === $(this).parent().text())
                  break;
               index++;
            }
            console.log(index)
            fetch(`/?index=${index}`, {
               method: "DELETE"
            }).then(res => res.text()).then(res => console.log(res));

         $(this).parent().hide("slow", () => {
            if (main_content.find(".task").length <= 1) {
               if (banner_empty.css("display") === "none") 
                  banner_empty.show("fast");

               

               $(this).parent().remove();
               banner_empty.css({
                  "filter": "opacity(1)",
                  "top": "45vh"
               });
            } else 
               $(this).parent().remove();
         });
      });

      // Task copy button
      copyBtn.click(function(event): void {
         let range = document.createRange();
         range.selectNode($(this).parent().find("p").get(0));
         window.getSelection().removeAllRanges();
         window.getSelection().addRange(range);
         document.execCommand("copy");
         window.getSelection().removeAllRanges();

         showModalWindow();
      });
         
      taskContent.css("color", colorSetting.currentTextCol);
      task.append(taskContent, taskTimestamp, deleteBtn, editBtn, copyBtn);
      main_content.append(task);

      this.content = content;
      this.element = task;
   }

   // Task jquery css
   css(prop: string, value: string | number | null = null): this {
      value? this.element.css(prop, value) : this.element.css(prop); 
      return this;
   } 

   static getDay(date: number): string {
      switch(date) {
         case 1: return "Mon";
         case 2: return "Tue";
         case 3: return "Wed";
         case 4: return "Thu";
         case 5: return "Fri";
         case 6: return "Sat";
         case 7: return "Sun";
      }
   }

   static getMonth(month: number): string {
      switch(month) {
         case 0: return "Jan";
         case 1: return "Feb";
         case 2: return "Mar";
         case 3: return "Apr";
         case 4: return "May";
         case 5: return "Jun";
         case 6: return "Jul";
         case 7: return "Aug";
         case 8: return "Sep";
         case 9: return "Oct";
         case 10: return "Nov";
         case 11: return "Dec";
      }
   }
}
