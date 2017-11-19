class FridgeCommentsController < ApplicationController
  # POST /fridge_comments
  # POST /fridge_comments.json
  def create
    @fridge_comment = FridgeComment.new(fridge_comment_params)

    respond_to do |format|
      if @fridge_comment.save
        format.json { render json: @fridge_comment, status: 201}
      else
        format.json { render json: @fridge_comment.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    # # Use callbacks to share common setup or constraints between actions.
    # def set_fridge_comments
    #   @fridge_comments = FridgeComment.find(params[:id])
    # end

    # Never trust parameters from the scary internet, only allow the white list through.
    def fridge_comment_params
      params.require(:fridge_comment).permit(:comment, :fridge_id)
    end
end
